## Project Setup

```sh
yarn install
```

```sh
yarn run dev
```

## Test

```sh
yarn run test:unit
```

## Supabase

```sh
yarn supabase start
```

```sh
yarn supabase db reset
```

```sh
yarn supabase status
```

### Create Migration

```sh
yarn supabase db diff -f {migration_name}
```

### Create Seeder

```sh
yarn supabase db dump --local --data-only -f dump.sql
```

### Edge Functions

```sh
yarn supabase functions new {function_name}
```

```sh
yarn supabase functions serve
```
