import os
import sys
import mimetypes
from supabase import create_client, Client

# Configuration
# Credentials must be provided via environment variables
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
VISA_DOCS_PATH = os.environ.get("VISA_DOCS_PATH")

USER_ID = "588f4a9a-85af-4684-abe8-8c414992cf6c"
VISA_ID = "9287e029-9cf6-4f3f-befd-c1fb68b7f39b"

DOCUMENT_TYPES = {
    "1. Identity evidence": "identity",
    "2. Marriage Documents": "marriage",
    "4. Financial Aspects": "financial",
    "5. Social Aspects": "social",
    "6. Nature of Commitment": "commitment"
}

def main():
    print("Initializing Supabase client...")
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Error: SUPABASE_URL and SUPABASE_KEY environment variables must be set.")
        sys.exit(1)

    if not VISA_DOCS_PATH:
        print("Error: VISA_DOCS_PATH environment variable must be set.")
        sys.exit(1)

    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"Error initializing client: {e}")
        sys.exit(1)

    # Check if tables exist
    print("Checking database tables...")
    try:
        # Check user_documents
        supabase.table("user_documents").select("*").limit(1).execute()
        # Check user_visa_purchases
        supabase.table("user_visa_purchases").select("*").limit(1).execute()
        print("Tables exist.")
    except Exception as e:
        print(f"\nError: Could not access tables. {e}")
        print("\nPlease ensure the migration `supabase/migrations/20260225000000_create_user_documents_and_purchases.sql` has been applied.")
        # If tables don't exist, we can't insert records. We should exit.
        sys.exit(1)

    # Check/Create Bucket
    print("Checking storage bucket 'documents'...")
    try:
        # List buckets to see if it exists
        buckets = supabase.storage.list_buckets()
        bucket_exists = False
        for b in buckets:
            # Check if b is dict or object
            b_name = b.name if hasattr(b, 'name') else b.get('name')
            if b_name == 'documents':
                bucket_exists = True
                break

        if not bucket_exists:
            print("Creating 'documents' bucket...")
            supabase.storage.create_bucket("documents", {"public": False})
        else:
            print("'documents' bucket exists.")
    except Exception as e:
        print(f"Warning: Could not check/create bucket: {e}")

    # Process files
    print(f"Scanning directory: {VISA_DOCS_PATH}")
    if not os.path.exists(VISA_DOCS_PATH):
        print(f"Error: Directory {VISA_DOCS_PATH} does not exist.")
        sys.exit(1)

    files_uploaded = 0

    for root, dirs, files in os.walk(VISA_DOCS_PATH):
        folder_name = os.path.basename(root)
        document_type = DOCUMENT_TYPES.get(folder_name)

        if not document_type:
            continue

        print(f"Processing folder: {folder_name} ({document_type})")

        for filename in files:
            file_path = os.path.join(root, filename)
            file_size = os.path.getsize(file_path)
            mime_type, _ = mimetypes.guess_type(file_path)

            storage_path = f"{USER_ID}/{document_type}/{filename}"

            print(f"  Uploading {filename} to {storage_path}...")

            try:
                with open(file_path, 'rb') as f:
                    file_content = f.read()

                # Upload to Storage
                # Note: supabase-py upload signature: upload(path, file, file_options)
                supabase.storage.from_("documents").upload(
                    path=storage_path,
                    file=file_content,
                    file_options={"upsert": "true", "contentType": mime_type}
                )

                # Insert into user_documents
                data = {
                    "user_id": USER_ID,
                    "file_name": filename,
                    "file_path": storage_path,
                    "document_type": document_type,
                    "mime_type": mime_type,
                    "file_size": file_size
                }
                supabase.table("user_documents").insert(data).execute()
                print("    Success.")
                files_uploaded += 1

            except Exception as e:
                print(f"    Failed: {e}")

    print(f"Uploaded {files_uploaded} files.")

    # Create user_visa_purchase
    print(f"Creating visa purchase for user {USER_ID} and visa {VISA_ID}...")
    try:
        purchase_data = {
            "user_id": USER_ID,
            "visa_id": VISA_ID,
            "status": "active"
        }
        # Use upsert to avoid unique constraint errors if re-run
        supabase.table("user_visa_purchases").upsert(purchase_data, on_conflict="user_id, visa_id").execute()
        print("Purchase record created/updated successfully.")
    except Exception as e:
        print(f"Error creating purchase: {e}")

if __name__ == "__main__":
    main()
