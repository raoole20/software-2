from django.core.management.base import BaseCommand
import csv
from django.contrib.auth import get_user_model
from django.db import transaction
from pathlib import Path
from django.utils.dateparse import parse_datetime, parse_date
import datetime


class Command(BaseCommand):
    help = "Seed users from a CSV file. If the password column contains Django hashed passwords they will be used directly."

    def add_arguments(self, parser):
        default_path = Path(__file__).resolve().parents[3] / 'id,password,last_login,is_superuser,user.txt'
        parser.add_argument('--file', '-f', type=str, default=str(default_path), help='Path to CSV file')
        parser.add_argument('--update', action='store_true', help='Update existing users (matched by username)')

    def handle(self, *args, **options):
        path = Path(options['file'])
        if not path.exists():
            self.stderr.write(self.style.ERROR(f'File not found: {path}'))
            return

        User = get_user_model()
        created = 0
        updated = 0
        skipped = 0

        with open(path, newline='', encoding='utf-8') as fh:
            reader = csv.DictReader(fh)
            with transaction.atomic():
                for row in reader:
                    username = (row.get('username') or row.get('email') or '').strip()
                    if not username:
                        self.stderr.write(self.style.WARNING('Skipping row without username/email'))
                        skipped += 1
                        continue

                    exists = User.objects.filter(username=username).exists()
                    if exists and not options['update']:
                        self.stdout.write(f'Skipping existing user {username} (use --update to modify)')
                        skipped += 1
                        continue

                    if exists:
                        user = User.objects.get(username=username)
                    else:
                        user = User()

                    # Basic fields
                    user.username = username
                    if 'first_name' in row:
                        user.first_name = row.get('first_name') or ''
                    if 'last_name' in row:
                        user.last_name = row.get('last_name') or ''
                    if 'email' in row:
                        user.email = row.get('email') or ''

                    def to_bool(v):
                        return str(v).strip() in ('1', 'True', 'true', 'yes', 'y')

                    if 'is_staff' in row and row.get('is_staff') not in (None, ''):
                        try:
                            user.is_staff = to_bool(row['is_staff'])
                        except Exception:
                            pass
                    if 'is_active' in row and row.get('is_active') not in (None, ''):
                        try:
                            user.is_active = to_bool(row['is_active'])
                        except Exception:
                            pass
                    if 'is_superuser' in row and row.get('is_superuser') not in (None, ''):
                        try:
                            user.is_superuser = to_bool(row['is_superuser'])
                        except Exception:
                            pass

                    # Password: if value looks like a Django hashed password (pbkdf2_sha256$...), set it directly.
                    pwd = row.get('password')
                    if pwd:
                        pwd = pwd.strip()
                        if pwd.startswith('pbkdf2_') or pwd.startswith('argon2$') or pwd.startswith('bcrypt'):
                            user.password = pwd
                        else:
                            # treat as plain text and hash it
                            user.set_password(pwd)

                    # Dates
                    if 'date_joined' in row and row.get('date_joined') and row['date_joined'] != 'NULL':
                        dt = parse_datetime(row['date_joined'])
                        if dt is None:
                            d = parse_date(row['date_joined'])
                            if d:
                                dt = datetime.datetime.combine(d, datetime.time())
                        if dt:
                            user.date_joined = dt

                    if 'last_login' in row and row.get('last_login') and row['last_login'] != 'NULL':
                        dt = parse_datetime(row['last_login'])
                        if dt:
                            user.last_login = dt

                    # Try to set extra fields if they exist on the model
                    extras = ['rol', 'sexo', 'fecha_nacimiento', 'carrera', 'universidad', 'semestre']
                    for key in extras:
                        if key in row and row[key] and row[key] != 'NULL' and hasattr(user, key):
                            val = row[key]
                            if key == 'fecha_nacimiento':
                                d = parse_date(val)
                                if d:
                                    setattr(user, key, d)
                                    continue
                            setattr(user, key, val)

                    try:
                        user.save()
                        if exists:
                            updated += 1
                        else:
                            created += 1
                        self.stdout.write(self.style.SUCCESS(f"Saved user: {username}"))
                    except Exception as e:
                        self.stderr.write(self.style.ERROR(f'Failed to save {username}: {e}'))

        self.stdout.write(self.style.NOTICE(f'Created: {created}, Updated: {updated}, Skipped: {skipped}'))
