import { useEffect, useState } from "react";
import axios from "axios";

function Quotes() {
  const [quote, setQuote] = useState({});
  const [error, setError] = useState("");

  async function getQuote() {
    try {
      const index = Math.floor(Math.random() * 100);
      const response = await axios.get(`https://dummyjson.com/quotes/${index}`);
      setQuote(response.data);
      console.log(response)
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  }
  useEffect(() => {
    getQuote();
  }, []);
  return (
    <>
    <div style={{position:"relative",textAlign:"center"}}>
        <h5>Today's Quote</h5>
      <p style={{color:"var(--accent)"}}>{quote.quote}</p>
      <p>-{quote.author}</p>
      </div>
    </>
  );
}

export default Quotes;
