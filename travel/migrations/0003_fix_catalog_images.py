from django.db import migrations


def fix_catalog_images(apps, schema_editor):
    Hotel = apps.get_model("travel", "Hotel")
    TravelPackage = apps.get_model("travel", "TravelPackage")

    hotel_images = {
        1: "hotels/goa_beach_resort.jpg",
        2: "hotels/kasol_valley_resort.jpg",
        3: "hotels/manali.jpg",
        4: "hotels/Ooty.webp",
        5: "hotels/munnar.webp",
    }

    package_images = {
        1: "packages/Goa.jpg",
        2: "packages/kasol_valley_resort.jpg",
        3: "packages/manali.jpg",
        4: "packages/Ooty.webp",
        5: "packages/munnar.webp",
    }

    for hotel_id, image_path in hotel_images.items():
        Hotel.objects.filter(id=hotel_id).update(image=image_path)

    for package_id, image_path in package_images.items():
        TravelPackage.objects.filter(id=package_id).update(image=image_path)


def reverse_fix_catalog_images(apps, schema_editor):
    Hotel = apps.get_model("travel", "Hotel")
    TravelPackage = apps.get_model("travel", "TravelPackage")

    Hotel.objects.filter(id__in=[1, 2, 3, 4, 5]).update(image="")
    TravelPackage.objects.filter(id__in=[1, 2, 3, 4, 5]).update(image="")


class Migration(migrations.Migration):

    dependencies = [
        ("travel", "0002_seed_catalog_images"),
    ]

    operations = [
        migrations.RunPython(
            fix_catalog_images,
            reverse_fix_catalog_images,
        ),
    ]
