const url = "https://api.cloudinary.com/v1_1/dighewixb/auto/upload";

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "bs7bgnxf");

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });
  console.log("response:", response)

  const responseData = await response.json();
  console.log("response: ", responseData)
  return responseData;
};
