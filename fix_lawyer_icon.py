import sys

with open('src/pages/lawyer/LawyerTracker.tsx', 'r') as f:
    content = f.read()

search = """  const outcomeIcon = {
    approved: CheckCircle,
    denied: XCircle,
    pending: Clock,
  };"""

replace = """  const outcomeIcon = {
    approved: CheckCircle,
    refused: XCircle,
    withdrawn: XCircle,
    pending: Clock,
  };"""

if search in content:
    content = content.replace(search, replace)

with open('src/pages/lawyer/LawyerTracker.tsx', 'w') as f:
    f.write(content)
