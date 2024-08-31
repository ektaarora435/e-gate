import { Scanner } from '@yudiel/react-qr-scanner';
import { set } from 'mongoose';
import {QRCodeSVG} from 'qrcode.react';
import { useEffect, useState } from 'react';
import VisitorGatePass from './VisitorGatePass';

const VisitorView = ({ session }) => {
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
      <VisitorGatePass session={session} />
    </>
  )
}

export default VisitorView;
