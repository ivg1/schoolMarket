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

create table stats (
    id integer generated always as identity primary key,
    total_listings_created bigint default 0
);
insert into stats (total_listings_created) values (0);