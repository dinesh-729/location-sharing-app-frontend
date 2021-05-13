import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
	const [isloading, setIsLoading] = useState(false);
	const [error, setError] = useState();

	const activeHttpRequst = useRef([]);

	const sendRequest = useCallback(async(
		url, 
		method = 'GET', 
		body=null, 
		headers={}
	) => {
		setIsLoading (true);
		const httpAbortController = new AbortController();
		activeHttpRequst.current.push(httpAbortController);
		try {
			const response = await fetch(url,{
				method,
				body,
				headers,
				signal: httpAbortController.signal
			});

			const responseData = await response.json();

			activeHttpRequst.current = activeHttpRequst.current.filter(
				reqCtrl => reqCtrl !== httpAbortController
			);

	        if(!response.ok) {
	          throw new Error(responseData.message);
	        }
	        
			setIsLoading (false);

	        return responseData;
		} catch (err) {
			setError(err.message);
			setIsLoading (false);
			throw err;
		}
	}, []);

	const clearError = () => {
		setError(null);
	};

	useEffect(()=>{
		return () => {
			activeHttpRequst.current.forEach(abortCtrl=> abortCtrl.abort());
		};
	},[]);

	return { isloading, error, sendRequest, clearError };
};