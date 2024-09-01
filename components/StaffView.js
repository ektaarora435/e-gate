import { Scanner } from '@yudiel/react-qr-scanner';
import { set } from 'mongoose';
import {QRCodeSVG} from 'qrcode.react';
import { useEffect, useState } from 'react';
import ResidentGatePass from './ResidentGatePass';

const StaffView = ({ session }) => {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanData, setScanData] = useState(null);
  const [passData, setPassData] = useState(null);
  const [enableApprove, setEnableApprove] = useState(false);
  const [passLogs, setPassLogs] = useState([]);
  const [expired, setExpired] = useState(false);
  const [expires, setExpires] = useState('');

  const fetchPassLogs = async () => {
      try {
        const res = await fetch(`/api/log`);
        const data = await res.json();
        setPassLogs(data);
      }
      catch (error) {
        console.error(error);
      }
  }
  
  useEffect(() => {
    fetchPassLogs();
  }, []);

  const toggleScanner = () => {
    setScannerOpen(!scannerOpen);
    setScanData(null);
    setPassData(null);
    fetchPassLogs();
  }

  const handleApprove = async () => {
    try {
      

      const res = await fetch(`/api/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: passData._id,
        })
      });
      const data = await res.json();

      alert('Gate pass approved');

      setPassData(null);
      setEnableApprove(false);
      fetchPassLogs();
    }
    catch (error) {
      alert('An error occurred while approving the gate pass');
    }
  }

  const formatUTCDateTo24Hr = dateObj => {
    if (!dateObj || dateObj === 'NA') return 'NA';

    const options = {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false // 24-hour format
    };

    const formatter = new Intl.DateTimeFormat('en-GB', options);
    const formattedDateParts = formatter.formatToParts(new Date(dateObj));

    // Extract the parts and format them
    const datePart = `${formattedDateParts[4].value}-${formattedDateParts[2].value}-${formattedDateParts[0].value}`;
    const timePart = `${formattedDateParts[6].value}:${formattedDateParts[8].value}:${formattedDateParts[10].value}`;

    return `${datePart} ${timePart}`;
  }

  return (
    <>
      <ResidentGatePass session={session} />
      <p className='mt-6'>
        <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded" onClick={toggleScanner}>
          Scan QR
        </button>
      </p>
      {scannerOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-description">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Scan QR Code
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500" id="modal-description">
                        {!passData && <Scanner onScan={async (result) => {
                          try {
                            const data = JSON.parse((result[0].rawValue));
                            setScanData(data);
                            const res = await fetch(`/api/passdetails?id=${data._id}`, {
                              method: "GET",
                              headers: {
                                "Content-Type": "application/json",
                              }
                            });
                            const json = await res.json();
                            setExpired(json.expired);
                            setPassData(json);
                          }
                          catch (error) {
                            alert('Invalid QR Code');
                            console.error(error);
                          }
                        }} />}
                        {passData && (
                          <>
                            <p>Name: {passData.user.name}</p>
                            <p>Email: {passData.user.email}</p>
                            <p>Entry Time: {formatUTCDateTo24Hr(passData.entryTime)}</p>
                            <p>Exit Time: {formatUTCDateTo24Hr(passData.exitTime)}</p>
                            {passData.user.role === 'visitor' && (<p>Expires On: {expires}</p>)}
                            <p>Purpose: {passData.purpose}</p>
                            <p>Status: {passData.status}</p>
                            {passData.status == 'expired' && (<p className='mt-2 text-red-500 font-bold'>Expired</p>)}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {passData && passData.status !== 'expired' && (<button type="button" className={"w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"} onClick={handleApprove}>
                  Approve
                </button>)}
                {
                  passData?.user?.role === 'visitor' && passData?.status === 'expired' && (
                    <button type="button" className={"w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"} disabled>
                      Expired
                    </button>
                  )
                }
                <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={toggleScanner}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='mt-6'>
        {/* table to view all logs */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Purpose
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                By
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {passLogs.map((log) => (
              <tr key={log._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-blue-600"><a href={`tel:+91${log.pass.user.phone}`}>{log.pass.user.name}</a>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatUTCDateTo24Hr(log.time)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{log.pass.purpose}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{log.status}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{log.by.name}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      </>
  )
}

export default StaffView;
