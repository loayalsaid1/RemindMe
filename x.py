import os

# Replace with your actual values
IMAGEKIT_PRIVATE_KEY = "private_edl1a45K3hzSaAhroLRPpspVRqM="
IMAGEKIT_PUBLIC_KEY = "public_tTc9vCi5O7L8WVAQquK6vQWNx08="
IMAGEKIT_URL_ENDPOINT = "https://ik.imagekit.io/loayalsaid1/"

from imagekitio  import ImageKit

ik = ImageKit(
    private_key=IMAGEKIT_PRIVATE_KEY,
    public_key=IMAGEKIT_PUBLIC_KEY,
    url_endpoint=IMAGEKIT_URL_ENDPOINT
)

        # Upload image to ImageKit
with open("OIP.jpg", "rb") as image_file:

	print(image_file)
	print(type(image_file))
	print(dir(image_file))
	# if image_file:
	# 	print("Image File Name:", image_file.name)
	# 	result = ik.upload_file(file=image_file, # required
    #                           file_name='my_file_name.jpg'
    #                           )

# # Final Result
# 		print(result)

# 		# Raw Response
# 		print(result.response_metadata.raw)
# 		print(result.url)
# 		print(result.file_path)
# 		print(result.file_type)
# 		print(result.name)
# 		print(result.response_metadata.raw)
# 		print(result.response_metadata.http_status_code)
# 		print(result.response_metadata.headers)
# 		print(result.size)
# 		print(result.custom_metadata)
# 		print(result.tags)
# 		print(result.status)
# 		if result.status == "success":
# 			image_url = result.url
# 			print(image_url)
		