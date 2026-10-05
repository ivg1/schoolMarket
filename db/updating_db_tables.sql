create table if not exists users (
    id integer generated always as identity primary key,
    fname text not null,
    lname text not null,
    username text not null,
    email text not null,
    password_hash text not null,
    phone text,
    profile_image text,
    about text default 'Hello world!',
    role text default 'user',
    is_mod bool default false,
    is_admin bool default false,
    listings_posted integer default 0,
    created_at timestamp default current_timestamp
);

alter table users
    add column if not exists fname text,
    add column if not exists lname text,
    add column if not exists username text,
    add column if not exists email text,
    add column if not exists password_hash text,
    add column if not exists phone text,
    add column if not exists profile_image text,
    add column if not exists about text default 'Hello world!',
    add column if not exists role text default 'user',
    add column if not exists is_mod bool default false,
    add column if not exists is_admin bool default false,
    add column if not exists listings_posted integer default 0,
    add column if not exists created_at timestamp default current_timestamp;



create table if not exists listings (
    id integer generated always as identity primary key,

    title text not null,
    description text,
    price integer,
    negotiable bool default false,
    tags text[],
    images text[],

    seller_id integer references users(id),
    seller_email text,
    seller_phone text,
    email_show bool default true,
    phone_show bool default true,

    is_physical bool default true,

    school_system text,
    school text,
    other_school text,
    school_class text,

    condition text,

    visibility bool default true,
    awaiting_moderation bool default true,

    created_at timestamp default current_timestamp
);

alter table listings
    add column if not exists title text,
    add column if not exists description text,
    add column if not exists price integer,
    add column if not exists negotiable bool default false,
    add column if not exists tags text[],
    add column if not exists images text[],

    add column if not exists seller_id integer,
    add column if not exists seller_email text,
    add column if not exists seller_phone text,
    add column if not exists email_show bool default true,
    add column if not exists phone_show bool default true,

    add column if not exists is_physical bool default true,

    add column if not exists school_system text,
    add column if not exists school text,
    add column if not exists other_school text,
    add column if not exists school_class text,

    add column if not exists condition text,

    add column if not exists visibility bool default true,
    add column if not exists awaiting_moderation bool default true,

    add column if not exists created_at timestamp default current_timestamp;



create table if not exists stats (
    id integer generated always as identity primary key,
    total_listings_created bigint default 0
);

alter table stats
    add column if not exists total_listings_created bigint default 0;

insert into stats (total_listings_created)
select 0
where not exists (
    select 1 from stats
);