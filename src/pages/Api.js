import { Fragment, useEffect, useState } from "react";

const Api = (props) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const getFromApi = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_HOST}/api/newsletter`
        );
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.log("Error: ", error);
      }
    };

    getFromApi();
  }, []);

  return (
    <Fragment>
      <p>{data ? "Data loaded" : "Loading..."}</p>
      {console.log(data)}
    </Fragment>
  );
};

export default Api;
