import { useSelector } from "react-redux";
export const useAsync = (argObj, argFunc) => {
  const getData = async () => {
    if (argObj.method === "PUT" || argObj.method === "POST") {
      try {
        const response = await fetch(argObj.url, {
          method: argObj.method,
          body: JSON.stringify(argObj.body),
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error("something went wronf");
        }
        const data = await response.json();
        if (argFunc) {
          argFunc(data);
        }
      } catch (error) {
        alert(error);
      }
    } else {
      try {
        const response = await fetch(argObj.url);
        if (!response.ok) {
          throw new Error("Something went wrong");
        }
        const data = await response.json();
        if (argFunc) {
          argFunc(data);
        }
      } catch (error) {
        alert(error);
      }
    }
  };

  return getData;
};

export const useChangeNode = (value) => {
  const name = useSelector((state) => state.auth.name);
  const uid = useSelector((state) => state.auth.uid);
  const sendRequest = async () => {
    try {
      const response = await fetch(
        `https://react-3e8f5-default-rtdb.firebaseio.com/${uid}.json`
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const data = await response.json();

      try {
        const response = await fetch(
          `https://react-3e8f5-default-rtdb.firebaseio.com/${uid}.json`,
          {
            method: "PUT",
            body: JSON.stringify({ ...data, ...value }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Something went wrong");
        }
      } catch (error) {
        alert(error);
      }
    } catch (error) {
      alert(error);
    }
  };
  return sendRequest;
};
