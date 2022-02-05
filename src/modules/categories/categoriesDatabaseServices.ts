export const fetchCategories = async () => {
  try {
    let response = await fetch(`/api/categories`, { method: "GET" });
    let data = await response.json();
    return data.message;
  } catch (error) {
    console.log(error);
  }
};
