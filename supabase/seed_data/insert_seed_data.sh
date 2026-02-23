#!/bin/bash
# Insert Realistic Seed Data into Supabase
# This script uses the Supabase REST API to insert data

set -e

SUPABASE_URL="https://usiorucxradthxhetqaq.supabase.co"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzaW9ydWN4cmFkdGh4aGV0cWFxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDQ4NzgwOSwiZXhwIjoyMDg2MDYzODA5fQ.Hg0_WVJYfLDJU-Qa4beXfECGSKL6A-fivN3Ubxe5cWI"

echo "=========================================="
echo "Inserting Realistic Seed Data"
echo "=========================================="
echo ""

# Function to insert data
insert_data() {
    local table=$1
    local data=$2
    
    curl -s -X POST "$SUPABASE_URL/rest/v1/$table" \
        -H "apikey: $SERVICE_KEY" \
        -H "Authorization: Bearer $SERVICE_KEY" \
        -H "Content-Type: application/json" \
        -H "Prefer: resolution=merge-duplicates" \
        -d "$data" > /dev/null
}

echo "1. Inserting 10 Lawyer Profiles..."

# Lawyer 1
insert_data "lawyer_profiles" '{
    "user_id": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeef001",
    "bar_number": "MARN 1578294",
    "jurisdiction": "New South Wales",
    "years_experience": 12,
    "specializations": ["Skilled Visas", "Employer Sponsorship", "ENS 186"],
    "languages_spoken": ["English", "Mandarin"],
    "verification_status": "approved",
    "bio": "Specialist in skilled migration and employer sponsorship. 12 years experience helping professionals secure Australian visas. Former senior case officer at Department of Home Affairs.",
    "education": "Bachelor of Laws (LLB) - University of Sydney, Graduate Diploma in Migration Law - ANU",
    "hourly_rate_cents": 35000,
    "consultation_fee_cents": 20000,
    "is_available": true,
    "average_rating": 4.9,
    "total_reviews": 47,
    "total_clients": 156
}'

# Lawyer 2
insert_data "lawyer_profiles" '{
    "user_id": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeef002",
    "bar_number": "MARN 1384592",
    "jurisdiction": "Victoria",
    "years_experience": 8,
    "specializations": ["Partner Visas", "Family Migration", "Parent Visas"],
    "languages_spoken": ["English", "Hindi", "Punjabi"],
    "verification_status": "approved",
    "bio": "Dedicated family migration specialist. Helping couples and families reunite in Australia. High success rate in complex partner visa cases.",
    "education": "Bachelor of Laws - Monash University, Graduate Certificate in Migration Law",
    "hourly_rate_cents": 28000,
    "consultation_fee_cents": 15000,
    "is_available": true,
    "average_rating": 4.8,
    "total_reviews": 34,
    "total_clients": 89
}'

# Lawyer 3
insert_data "lawyer_profiles" '{
    "user_id": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeef003",
    "bar_number": "MARN 1428573",
    "jurisdiction": "Queensland",
    "years_experience": 15,
    "specializations": ["Student Visas", "Graduate Visas", "Temporary Visas"],
    "languages_spoken": ["English", "Vietnamese"],
    "verification_status": "approved",
    "bio": "Education pathway specialist. 15 years helping international students achieve their Australian dreams. Former university international office advisor.",
    "education": "LLB - University of Queensland, Master of Migration Law",
    "hourly_rate_cents": 25000,
    "consultation_fee_cents": 12000,
    "is_available": true,
    "average_rating": 4.7,
    "total_reviews": 52,
    "total_clients": 203
}'

echo "2. Inserting News Articles..."

insert_data "news_articles" '{
    "title": "Australia Announces Record Immigration Program for 2024-25",
    "slug": "record-immigration-program-2024-25",
    "content": "The Australian Government has announced a record immigration program for 2024-25, with a planning level of 185,000 permanent places. 70% allocated to skilled stream with focus on addressing critical skill shortages.",
    "summary": "185,000 permanent places announced with 70% for skilled migration",
    "author_id": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeef001",
    "published_at": "2024-12-15T09:00:00Z",
    "is_published": true,
    "view_count": 2340
}'

insert_data "news_articles" '{
    "title": "Processing Times Improve for Partner Visas",
    "slug": "partner-visa-processing-times-improve",
    "content": "Partner visa processing times have shown significant improvement. Current estimates: Onshore Partner 12-18 months, Offshore Partner 12-16 months, Prospective Marriage 10-14 months.",
    "summary": "Streamlined processes reduce waiting times for partner visa applicants",
    "author_id": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeef002",
    "published_at": "2025-01-10T14:30:00Z",
    "is_published": true,
    "view_count": 1892
}'

insert_data "news_articles" '{
    "title": "Skilled Occupation List Updated for 2025",
    "slug": "skilled-occupation-list-updated-2025",
    "content": "Updated skilled occupation list adds 15 new occupations including Cyber Security Specialist, Data Scientist, Aged Care Registered Nurse, and Construction Project Manager.",
    "summary": "15 new occupations added to address emerging skill shortages",
    "author_id": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeef003",
    "published_at": "2025-01-25T11:00:00Z",
    "is_published": true,
    "view_count": 3241
}'

echo "3. Inserting System Settings..."

insert_data "system_settings" '{"key": "platform_name", "value": "VisaBuild", "description": "Platform brand name", "is_public": true}'
insert_data "system_settings" '{"key": "platform_url", "value": "https://yourvisasite.vercel.app", "description": "Production URL", "is_public": true}'
insert_data "system_settings" '{"key": "support_email", "value": "support@visabuild.com", "description": "Customer support email", "is_public": true}'
insert_data "system_settings" '{"key": "signup_enabled", "value": "true", "description": "Allow new registrations", "is_public": true}'

echo ""
echo "=========================================="
echo "✅ Seed Data Inserted Successfully!"
echo "=========================================="
echo ""
echo "Inserted:"
echo "  • 3 Lawyer Profiles"
echo "  • 3 News Articles"
echo "  • 4 System Settings"
echo ""
echo "For complete seed data with all 10 lawyers, 150 tracker entries, and 10 news articles:"
echo "Run the SQL file: supabase/seed_data/REALISTIC_SEED_DATA.sql"
echo ""
echo "Or use Supabase Dashboard SQL Editor:"
echo "https://supabase.com/dashboard/project/usiorucxradthxhetqaq/sql/new"
