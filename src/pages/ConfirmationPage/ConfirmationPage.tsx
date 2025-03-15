import { useNavigate, useSearchParams } from "react-router-dom";
import './ConfirmationPage.scss'
import { useEffect } from "react";
import axios from "axios";

function ConfirmationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      return;
    }

    axios
      .post(`${import.meta.env.VITE_APP_API_URL}/confirmation/${token}`)
      .then((res) => {
        navigate(res.data.redirectUrl);
      })
      .catch((err) => {
        console.log(err);
        navigate('/login?confirmed=false');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='confirmationPage'>
    </div>
  )

}

export default ConfirmationPage;
