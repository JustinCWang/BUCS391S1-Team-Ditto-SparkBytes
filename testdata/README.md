## Prerequisites

Before using the test data, please ensure that you have set up a supabase account [README](../README.md)

## How to use and set up Test Data:

1. Enter your Supabase project and click on Table Editor and click new Table
2. Recreate the tables following the database schema in the [Documentation](../Documentation.pdf)
3. Implement the Row Level Security (RLS) for each of the tables as documented in the [Documentation](../Documentation.pdf)
4. Naviagate to the Authentication Tab in Supabase and select the Users section.
5. Click Add User and click and fill out "Create a new user" for each test user in [Users_rows.csv](./Users_rows.csv)
6. Using the test admin user's UID's, assign the event's to them however you like by filling in the ```organizer_id``` field in [Events_rows.csv](./Events_rows.csv)
7. Open [Users_rows.csv](./Users_rows.csv) and fill in the UID field with the UID generated in auth/users for each test user. 
8. Upload the CSV data files in the following orders to respect foreign keys: Users_rows.csv --> Food_rows.csv --> Events_rows.csv --> Liked_events.csv
9. You are all set!

## Test Accounts (User & Admins)

The test data provides 4 admin accounts to simulate a administrative team running Spark!Bytes. 

```bash
Admin Email: admin#@bu.edu (# = 1-4)
Admin Pass: admin123 <-- Use this password for all admin test accounts for consistency
```

There is also one user account pre-made for user testing. 

```bash
User Email: user@bu.edu
User user1234 <-- Use this password for all user test accounts for consistency
```

Note: All other test student accounts fall under user test accounts. 
