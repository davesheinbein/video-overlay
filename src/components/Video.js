import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';

const Video = () => {
	const videoRef = useRef();
	const canvasRef = useRef();

	const videoWidth = 720;
	const videoHeight = 560;

	const [display, setDisplay] = useState(false);

	useEffect(() => {
		const loadModels = async () => {
			const MODEL_URL = process.env.PUBLIC_URL + '/models';
			setDisplay(true);
			Promise.all([
				faceapi.nets.tinyFaceDetector.loadFromUri(
					MODEL_URL
				),
				faceapi.nets.faceLandmark68Net.loadFromUri(
					MODEL_URL
				),
				faceapi.nets.faceRecognitionNet.loadFromUri(
					MODEL_URL
				),
				faceapi.nets.faceExpressionNet.loadFromUri(
					MODEL_URL
				),
			]).then(startVideo);
		};
		loadModels();
	}, []);
	// }, [videoRef]);

	const startVideo = () => {
		if (!!videoRef && !!videoRef.current) {
			navigator.getUserMedia(
				{ video: {} },
				(stream) => (videoRef.current.srcObject = stream),
				(err) => console.error('error:', err)
			);
		}
	};

	const handleVideoOnPlay = () => {
		if (!!videoRef && !!videoRef.current) {
			setInterval(async () => {
				if (!!display) {
					setDisplay(false);
				}

				// canvasRef.current;
				if (!!canvasRef && !!canvasRef.current) {
					canvasRef.current.innerHTML =
						faceapi.createCanvasFromMedia(videoRef.current);

					const displaySize = {
						width: videoWidth,
						height: videoHeight,
					};
					faceapi.matchDimensions(
						canvasRef.current,
						displaySize
					);

					const detections = await faceapi
						.detectAllFaces(
							videoRef.current,
							new faceapi.TinyFaceDetectorOptions()
						)
						.withFaceLandmarks()
						.withFaceExpressions();

					const resizedDetections = faceapi.resizeResults(
						detections,
						displaySize
					);
					canvasRef.current
						.getContext('2d')
						.clearRect(0, 0, videoWidth, videoHeight);

					faceapi.draw.drawDetections(
						canvasRef.current,
						resizedDetections
					);
					faceapi.draw.drawFaceLandmarks(
						canvasRef.current,
						resizedDetections
					);
					faceapi.draw.drawFaceExpressions(
						canvasRef.current,
						resizedDetections
					);
				}
			}, 100);
		}
	};

	// const myIframe = document.getElementById('myIframe');
	// if (!!myIframe) {
	// 	const iframeWindow = myIframe.contentWindow;
	// 	const iframeDocument = myIframe.contentDocument;
	// 	const iframeDoc = myIframe.document;
	// 	console.log('🚀 ~ myIframe', myIframe);
	// 	console.log('🚀 ~ iframeWindow', iframeWindow);
	// 	console.log('🚀 ~ iframeDocument', iframeDocument);
	// 	console.log('🚀 ~ iframeDoc', iframeDoc);
	// }
	// faceapi.nets.faceRecognitionNet.loadFromUri;

	return (
		<div className='video'>
			{/* <iframe
				id='myIframe'
				className='video__iframe'
				width='560'
				height='315'
				src='https://www.youtube.com/embed/cLNyF1Zw5tg'></iframe> */}
			{!!display ? (
				<h1 id='status'>Ready</h1>
			) : (
				<h1 id='status'>Loading...</h1>
			)}
			<div className='video__vid'>
				<video
					id='webcam'
					// playsInline
					width={videoWidth}
					height={videoHeight}
					ref={videoRef}
					autoPlay
					muted
					className='video__vid-player'
					onPlay={handleVideoOnPlay}></video>
				<canvas
					id='output'
					className='video__vid-canvas'
					ref={canvasRef}></canvas>
			</div>
		</div>
	);
};

export default Video;
