import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';

const Video = () => {
	const videoRef = useRef();
	const canvasRef = useRef();

	const videoWidth = 720;
	const videoHeight = 560;

	const [displayFaceTracking, setDisplayFaceTracking] =
		useState(false);

	const pauseWebcam = () => {
		videoRef.current.pause();
		videoRef.current.srcObject.getTracks()[0].stop();
		setDisplayFaceTracking(false);
	};

	useEffect(() => {
		const loadModels = async () => {
			const MODEL_URL = process.env.PUBLIC_URL + '/models';
			setDisplayFaceTracking(true);
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
			// navigator.mediaDevices.getUserMedia(
			// 	{ video: {} },
			// 	(stream) => (videoRef.current.srcObject = stream),
			// 	(err) => console.error('error:', err)
			// );

			navigator.mediaDevices
				.getUserMedia({
					video: true,
				})
				.then(
					(stream) => (videoRef.current.srcObject = stream),
					(err) => console.log(err)
				);
		}
	};

	const handleVideoOnPlay = () => {
		if (!!videoRef && !!videoRef.current) {
			setInterval(async () => {
				if (!!displayFaceTracking) {
					setDisplayFaceTracking(false);
				}

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
					// console.log('🚀 ~ detections', detections);
					// console.log(
					// 	'🚀 ~ detections[0].alignedRect',
					// 	detections[0].alignedRect
					// );
					// console.log(
					// 	'🚀 ~ detections[0].detection',
					// 	detections[0].detection
					// );
					// console.log(
					// 	'🚀 ~ detections[0].expressions',
					// 	detections[0].expressions
					// );
					// console.log(
					// 	'🚀 ~ detections[0].landmarks',
					// 	detections[0].landmarks
					// );
					// console.log(
					// 	'🚀 ~ detections[0].unshiftedLandmarks',
					// 	detections[0].unshiftedLandmarks
					// );

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

	const checkInnerDocs = () => {
		const iframe = !!document.getElementById('iframeId')
			? document.getElementById('iframeId')
			: '';
		if (!!iframe) {
			console.log('🚀 ~ iframe', !!iframe ? iframe : null);
			let innerDoc = iframe?.contentDocument;
			// let innerContentWindow =
			// 	iframe?.contentWindow?.document;

			console.log(
				'🚀 ~ innerDoc',
				!!innerDoc ? innerDoc : 'null'
			);
			console.log(
				'🚀 ~ innerDoc',
				!!innerDoc ? innerDoc.document : 'null'
			);
			console.log(
				'🚀 ~ innerDoc',
				!!innerDoc ? innerDoc.contentDocument : 'null'
			);
			console.log(
				'🚀 ~ innerDoc',
				!!innerDoc ? innerDoc.contentWindow : 'null'
			);
			console.log(
				'🚀 ~ innerDoc',
				!!innerDoc
					? innerDoc.contentWindow.document
					: 'null'
			);
			// console.log(
			// 	'🚀 ~ innerContentWindow',
			// 	!!innerContentWindow ? innerContentWindow : 'null'
			// );
		}
	};

	return (
		<div className='video'>
			{/* <iframe
				id='myIframe'
				className='video__iframe'
				width='560'
				height='315'
				src='https://www.youtube.com/embed/cLNyF1Zw5tg'></iframe> */}
			<span>
				<h1 id='status'>
					Face Tracking:{' '}
					{!displayFaceTracking ? 'Active' : 'Loading...'}
				</h1>
				<button onClick={pauseWebcam}>Close</button>
				<button onClick={checkInnerDocs}>Consol log</button>
			</span>
			{/* <div className='video__vid'>
				<video
					id='webcam'
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
			</div> */}
			<iframe
				width='560'
				height='315'
				src='https://www.youtube.com/embed/gODZzSOelss'
				title='YouTube video player'
				frameBorder='0'
				allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
				sandbox='allow-same-origin'
				allowFullScreen
				id='iframeId'></iframe>
                
		</div>
	);
};

export default Video;
