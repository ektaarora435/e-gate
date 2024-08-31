import {QRCodeSVG} from 'qrcode.react';
import { useEffect, useState } from 'react';

const VisitorGatePass = ({ session }) => {
  const [gatePass, setGatePass] = useState([]);
  const [expires, setExpires] = useState('');
  const [expired, setExpired] = useState(false);
  
  const fetchGatePass = async () => {
      try {
        const res = await fetch(`/api/gatepasses`);
        const data = await res.json();

        setGatePass(data);

        if (!data || data.length === 0) return;
        
        let date = new Date(data[0].date) ;
        date.setHours(date.getHours() + 6);
        setExpires(date.toLocaleString());
        setExpired(new Date() > date);
      } catch (error) {
        console.error(error);
      }
  };

  useEffect(() => {
    fetchGatePass();
  }, []);

  const createGatePass = async () => {
    try {
      const res = await fetch(`/api/gatepasses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ purpose: prompt('Purpose of Visit', 'visitor') }),
      });
      const data = await res.json();
      setGatePass(data);
      fetchGatePass();
    } catch (error) {
      console.error(error);
    }
  }

  const checkExpired = () => {
    let now = new Date(gatePass[0].date);
    let expires = new Date(gatePass[0].date) ;
    expires.setSeconds(expires.setSeconds() + 6);
    return now > expires;
  }

  return (
    <>
    {gatePass && gatePass.length > 0 && !expired ? (
      <>
        <div key={gatePass[0]._id}>
          <p className='text-red-500 font-bold mb-6'>Expires at {expires}</p>
          <QRCodeSVG value={JSON.stringify(gatePass[0])} className='mb-6' />
          <p>Entry Time: {gatePass[0].entryTime || 'NA'}</p>
          <p>Exit Time: {gatePass[0].exitTime || 'NA'}</p>
          <p>Purpose: {gatePass[0].purpose}</p>
          <p>Status: {gatePass[0].status}</p>
        </div>
      </>
    ) : (
      <>
        <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded" onClick={createGatePass} >
          Generate Gate Pass
        </button>
      </>
    )}
    </>
  )
}

export default VisitorGatePass;
