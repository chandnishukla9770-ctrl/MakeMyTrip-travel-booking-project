from django.db import migrations


def ensure_catalog_images(apps, schema_editor):
    Hotel = apps.get_model("travel", "Hotel")
    TravelPackage = apps.get_model("travel", "TravelPackage")

    hotel_images = {
        "Goa Beach Resort": "hotels/goa_beach_resort.jpg",
        "Kasol valley resort": "hotels/kasol_valley_resort.jpg",
        "Snow valley resort, manali": "hotels/manali.jpg",
        "The Abode by brown tree resort": "hotels/Ooty.webp",
        "Munnar tea hills resort": "hotels/munnar.webp",
    }

    package_images = {
        "Goa beach holiday": "packages/Goa.jpg",
        "Kasol mountain escape": "packages/kasol_valley_resort.jpg",
        "Snow valley resort, manali": "packages/manali.jpg",
        "The Abode by brown tree resort": "packages/Ooty.webp",
        "Munnar tea hills resort": "packages/munnar.webp",
    }

    for name, image_path in hotel_images.items():
        Hotel.objects.filter(name=name).update(image=image_path)

    for name, image_path in package_images.items():
        TravelPackage.objects.filter(name=name).update(image=image_path)


class Migration(migrations.Migration):

    dependencies = [
        ("travel", "0003_fix_catalog_images"),
    ]

    operations = [
        migrations.RunPython(ensure_catalog_images),
    ]
