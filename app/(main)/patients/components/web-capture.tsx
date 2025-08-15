import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useState } from 'react'
import Webcam from 'react-webcam'

const videoConstraints = {
    width: 270,
    height: 200,
    facingMode: "user"
};

export default function WebCapture({onCapture}: {onCapture: (value: string) => void}) {
    const webcamRef = React.useRef<Webcam>(null);
    const [imgSrc, setImgSrc] = useState<any>(null);
    const capture = React.useCallback(
        () => {
            const imageSrc = webcamRef.current?.getScreenshot({width: 270, height: 200});
            setImgSrc(imageSrc);
            onCapture(imageSrc as string)
        },
        [webcamRef, onCapture]
    );
    return (
        <div className='rounded-md'>
            {!imgSrc && <Webcam
                audio={false}
                height={200}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={270}
                videoConstraints={videoConstraints}
                className='rounded-md mb-2'
            />}
            {imgSrc && (
                <Image
                    src={imgSrc}
                    alt="Captured"
                    className='rounded-md mb-2'
                />
            )}
            <Button onClick={capture}>Capture photo</Button>
        </div>
    );
}
