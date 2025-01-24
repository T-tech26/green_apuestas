import React, { useEffect } from 'react'

const FootBallApi = () => {
    useEffect(() => {
        // Dynamically load the script
        const script = document.createElement('script');
        script.src = 'https://ls.soccersapi.com/widget/res/w_default/widget.js';
        script.type = 'text/javascript';
        document.body.appendChild(script);
    
        // Cleanup the script after the component is unmounted
        return () => {
            document.body.removeChild(script);
        };
    }, []);
    


    return (
        <main className='flex-1'>
            <div id="ls-widget" data-w="w_default" className="livescore-widget"></div>
        </main>
    )
}

export default FootBallApi