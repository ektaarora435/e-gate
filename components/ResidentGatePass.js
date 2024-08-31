import {QRCodeSVG} from 'qrcode.react';
import { useEffect, useState } from 'react';

const ResidentGatePass = ({ session }) => {
  const [gatePass, setGatePass] = useState([]);
  
  const fetchGatePass = async () => {
      try {
        const res = await fetch(`/api/gatepasses`);
        const data = await res.json();
        setGatePass(data);
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
        }
      });
      const data = await res.json();
      setGatePass(data);
      fetchGatePass();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
    {gatePass && gatePass.length > 0 ? (
      <>
        {gatePass.map((pass) => (
          <div key={pass._id}>
            <QRCodeSVG value={JSON.stringify(pass)} className='mb-6' />
            <p>Entry Time: {pass.entryTime || 'NA'}</p>
            <p>Exit Time: {pass.exitTime || 'NA'}</p>
            <p>Purpose: {pass.purpose}</p>
            <p>Status: {pass.status}</p>
          </div>
        ))}
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

export default ResidentGatePass;
