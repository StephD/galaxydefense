# Galaxy Defense Supabase Setup

This directory contains the SQL migrations for setting up the Galaxy Defense database in Supabase.

## Database Structure

The database consists of three main tables:

1. `chips` - Stores all chip data including name, description, compatible gear types, affected tower types, boost type, and values per rarity level
2. `gear_types` - Stores the available gear types
3. `tower_types` - Stores the available tower types

## Setting Up Supabase

1. Create a new Supabase project at [https://app.supabase.com](https://app.supabase.com)
2. Once your project is created, navigate to the SQL Editor
3. Copy the contents of the `migrations/20250619_create_chips_tables.sql` file
4. Paste the SQL into the SQL Editor and run it

## Environment Variables

Add the following environment variables to your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can find these values in your Supabase project dashboard under Settings > API.

## Security

The SQL migrations include Row Level Security (RLS) policies that:
- Allow anyone to read data from all tables
- Only allow authenticated users to insert new chips

## Data Structure

### Chips Table

Each chip has the following structure:
- `id`: UUID (automatically generated)
- `name`: Text (chip name)
- `description`: Text (chip description)
- `compatible_gears`: Text array (list of compatible gear types)
- `affected_towers`: Text array (list of affected tower types)
- `boost_type`: Text (type of boost provided)
- `values`: JSONB (object with values for each rarity level)
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Sample Query

To fetch all chips:

```sql
SELECT * FROM chips;
```

To fetch chips compatible with a specific gear type:

```sql
SELECT * FROM chips WHERE 'Weapon' = ANY(compatible_gears);
```
