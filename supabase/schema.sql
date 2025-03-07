-- Create users table
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  name text,
  avatar_url text,
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  constraint users_email_key unique (email)
);

-- Create matches table
create table public.matches (
  id uuid default gen_random_uuid() primary key,
  player1_id uuid references public.users(id) not null,
  player2_id uuid references public.users(id) not null,
  player1_score integer not null,
  player2_score integer not null,
  status text default 'pending' not null, -- 'pending', 'approved', 'rejected'
  reviewed_by uuid references public.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.matches enable row level security;

-- Users policies
create policy "Users can view all users"
  on public.users for select
  to authenticated
  using (true);

create policy "Users can update their own profile"
  on public.users for update
  to authenticated
  using (auth.uid() = id);

-- Matches policies
create policy "Users can view all matches"
  on public.matches for select
  to authenticated
  using (true);

create policy "Users can create matches"
  on public.matches for insert
  to authenticated
  using (
    auth.uid() = player1_id or 
    auth.uid() = player2_id
  );

create policy "Only admins can update match status"
  on public.matches for update
  to authenticated
  using (
    exists (
      select 1 from public.users
      where id = auth.uid()
      and is_admin = true
    )
  );

-- Create a function to handle user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', new.email),
    coalesce(new.raw_user_meta_data->>'avatar_url', NULL)
  );
  return new;
end;
$$;

-- Create a trigger to handle new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();