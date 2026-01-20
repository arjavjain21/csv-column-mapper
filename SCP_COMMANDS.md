# SCP Commands to Copy Files to Local System

## Copy SQL Migration File

```bash
scp hyperke-vps:/home/ubuntu/apps/csv-column-mapper/SUPABASE_MIGRATION.sql ~/Downloads/
```

## Copy DNS Setup Guide

```bash
scp hyperke-vps:/home/ubuntu/apps/csv-column-mapper/DNS_SETUP_GUIDE.md ~/Downloads/
```

## Copy Both Files at Once

```bash
scp hyperke-vps:/home/ubuntu/apps/csv-column-mapper/{SUPABASE_MIGRATION.sql,DNS_SETUP_GUIDE.md} ~/Downloads/
```

## Copy Entire Project Directory (if needed)

```bash
scp -r hyperke-vps:/home/ubuntu/apps/csv-column-mapper ~/Downloads/
```

## Alternative: Copy to Current Directory

If you want to copy to your current directory instead of Downloads:

```bash
# SQL file only
scp hyperke-vps:/home/ubuntu/apps/csv-column-mapper/SUPABASE_MIGRATION.sql .

# DNS guide only
scp hyperke-vps:/home/ubuntu/apps/csv-column-mapper/DNS_SETUP_GUIDE.md .

# Both files
scp hyperke-vps:/home/ubuntu/apps/csv-column-mapper/{SUPABASE_MIGRATION.sql,DNS_SETUP_GUIDE.md} .
```

## Verify Files After Copy

```bash
ls -lh ~/Downloads/SUPABASE_MIGRATION.sql ~/Downloads/DNS_SETUP_GUIDE.md
```

## Notes

- Replace `~/Downloads/` with your desired destination path
- The `hyperke-vps` alias should be configured in your `~/.ssh/config` file
- If the alias doesn't work, use the full SSH command format:
  ```bash
  scp user@host:/path/to/file ~/Downloads/
  ```
