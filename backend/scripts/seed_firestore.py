"""Seed Firestore with initial site content.

Usage (from backend/, with GCP application-default credentials configured):

    CONNECTOR=gcp GCP_PROJECT_ID=your-project python -m scripts.seed_firestore
    # add --overwrite to replace existing documents

Runs against whatever connector CONNECTOR selects, so it can also be used to
inspect the mock seed locally.
"""

import argparse

from app.connectors.factory import get_database
from app.config import get_settings
from app.seed import seed_database


def main() -> None:
    parser = argparse.ArgumentParser(description="Seed the portfolio database.")
    parser.add_argument("--overwrite", action="store_true",
                        help="Overwrite existing documents instead of skipping populated collections.")
    args = parser.parse_args()

    settings = get_settings()
    print(f"Connector: {settings.connector} | project: {settings.gcp_project_id or '(n/a)'}")
    counts = seed_database(get_database(), overwrite=args.overwrite)
    for collection, count in counts.items():
        print(f"  seeded {count:>3} into {collection}")
    print("Done.")


if __name__ == "__main__":
    main()
