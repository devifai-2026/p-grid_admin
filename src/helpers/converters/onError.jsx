export const onError = (r) => {
  let error_msg = "Something Went Wrong! Please Try again Later!";

  if (typeof r === "string") {
    error_msg = r;
  } else if (r?.data?.message) {
    error_msg = r.data.message;
  } else if (r?.r?.data?.message) {
    error_msg = r.r.data.message;
  } else if (r instanceof Error) {
    error_msg = r.message;
  } else if (r?.message) {
    error_msg = r.message;
  } else if (r?.statusText) {
    error_msg = r.statusText;
  }

  console.error("Error:", error_msg);
  alert(error_msg);
};
export const throwError = (r) => {
  throw new Error(
    r?.data?.message || "Something Went Wrong! Please Try again Later!",
  );
};
