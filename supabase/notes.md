## Migrations

### Create migration:

```
supabase migration new create_employees_table
```

### Diff

```
supabase db diff --schema public
```

### Diff output to file

```
supabase db diff --schema public -f <filename>
```
