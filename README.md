# Team-Ditto-Spark!Bytes (WIP README)
A working software application system developed as part of BU CS391 S1 that enables Boston University (BU) the ability to access extra food from events and other sources at Boston University. This software system is called Spark!Bytes.

## Prerequisites

Before running the app, you’ll need to set up a supabase account:

### [Supabase](https://supabase.com)

1. Click on new project then create a Supabase project.
2. Then go to project settings and click on Data API.
3. Note down the supabase URL and anon public key for you .env file later.

## Frontend

To set up and run the frontend locally:

### Installation

You will need to go into the frontend directory then install all the dependencies for the project.

```bash
cd frontend
npm install
```

### Environment Variables

Create a .env file in the frontend directory. Then you will need to define your environment variables. Using what you noted down earlier from the prerequisite.

```bash
NEXT_PUBLIC_SUPABASE_URL="your url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your anon key"
```

### Development Server

Then you can start your devlopment server!

```bash
npm run dev
```
