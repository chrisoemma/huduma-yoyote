      //   const myChannel = pusher.subscribe({
      //     channelName: `private-location-updates.${user.id}`,
      //     headers: headers,
      //     onEvent: (event) => {
      //         console.log('Event received:', event);
      
      //         // Parse event data
      //         const eventData = JSON.parse(event.data);
      
      //         // Check if the event name is "ClientLocationUpdated"
      //         if (event.eventName === "App\\Events\\ClientLocationUpdated") {
      //             console.log('Received ClientLocationUpdated event:', eventData.clientData);
      
      //             // Extract latitude and longitude
      //             const { latitude, longitude } = eventData.clientData;
      
      //             // Handle the received location data here
      //             console.log('Latitude:', latitude);
      //             console.log('Longitude:', longitude);
      //         }
      //     },
      // });





      
  useEffect(() => {
      const setupPusher = async () => {
        const headers = {
          'Authorization': `Bearer ${user.token}`
        };
  
        try {
          await pusher.init({
            apiKey: "70f571d3d3621db1c3d0",
            cluster: "ap2",
           // authEndpoint: `${API_URL}/pusher/auth`,
            // onAuthorizer: async (channelName, socketId) => {
            //   try {
            //     const response = await fetch(`${API_URL}/pusher/auth`, {
            //       method: 'POST',
            //       headers: {
            //         'Content-Type': 'application/json',
            //         ...headers,
            //       },
            //       body: JSON.stringify({
            //         socket_id: socketId,
            //         channel_name: channelName,
            //         userId: user.id
            //       }),
            //     });
            //     if (!response.ok) {
            //       throw new Error('Network response was not ok');
            //     }
            //     const authData = await response.json();
            //     console.log('Auth data:', authData);
            //     return authData.auth;
            //   } catch (error) {
            //     console.error('Error during Pusher authentication:', error);
            //     throw error;
            //   }
            // },
          });
          
  
          console.log("Pusher initialized");
          await pusher.connect();
          console.log('connectedd')
          await pusher.subscribe({
            channelName: `location-updates`,
            onSubscriptionSucceeded:(channelName:string, data:any)=> {
              console.log('Subscription succeeded:', channelName, data);
            },
            onSubscriptionError: (channelName, message, e) => {
              console.log(`onSubscriptionError: ${message} channelName: ${channelName} Exception: ${e}`);
            },
         
            onEvent: (event: PusherEvent) => {
              if (extractEventName(event.eventName) === "ClientLocationUpdated") {
  
                console.log('passed this state');
                // if (event.data) {
                //   const parsedData = JSON.parse(event.data);
                //   const latitude = parseFloat(parsedData.client_location.latitude);
                //   const longitude = parseFloat(parsedData.client_location.longitude);
                //   console.log('Received ClientLocationUpdated event:', longitude);
                //   setUserLocation({ latitude, longitude });
                // }
              }
            },
          });
        
      
        } catch (e) {
          console.log(`ERROR: ${e}`);
        }
      };
      
      setupPusher() 
      return () => {
      //  await pusher.reset();
       pusher.unsubscribe({channelName:`location-updates`});
      };
    },[]);