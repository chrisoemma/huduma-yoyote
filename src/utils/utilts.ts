import { Linking } from 'react-native';
import { GOOGLE_MAPS_API_KEY } from './config';
import { colors } from './colors';


export const currencyFormatter: any = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'TZS',
});

export const stripHtml = (html: any) => {
  return html.replace(/<[^>]*>?/gm, '');
};

export const truncate = (input: any, length: number) => {
  if (input.length > length) {
    return input.substring(0, length) + '...';
  }
  return input;
};

export const getAverageRating = (ratings: any) => {
  const average =
    ratings.reduce((total: any, next: any) => total + next.rating, 0) /
    ratings.length;

  return average ? average : 0;
};


export const makePhoneCall = phoneNumber => {
  Linking.openURL(`tel:${phoneNumber}`)
    .catch(error => {
      console.error('Error making phone call: ', error);
    });
};


// function calculateDistance(lat1, lon1, lat2, lon2) {
//   const R = 6371; 
//   const dLat = (lat2 - lat1) * (Math.PI / 180);
//   const dLon = (lon2 - lon1) * (Math.PI / 180);

//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   const distance = R * c; // Distance in kilometers

//   return distance;
// }


export function validateTanzanianPhoneNumber(phoneNumber) {
  // Remove any spaces and non-numeric characters
  const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');

  // Check the length and format
  if (cleanedPhoneNumber.match(/^(0\d{9}|255\d{9})$/)) {
    // Valid Tanzanian phone number format
    if (cleanedPhoneNumber.startsWith('0')) {
      return `+255${cleanedPhoneNumber.substring(1)}`;
    } else if (cleanedPhoneNumber.startsWith('255')) {
      return `+${cleanedPhoneNumber}`;
    } else if (cleanedPhoneNumber.startsWith('+255')) {
      return cleanedPhoneNumber; // No change if already formatted as '+255'
    }
  } else {
    // Invalid phone number format
    return null;
  }
}

export const formatDate = (d) => {
  date = new Date(d);
  year = date.getFullYear();
  month = date.getMonth() + 1;
  dt = date.getDate();

  if (dt < 10) {
    dt = "0" + dt;
  }
  if (month < 10) {
    month = "0" + month;
  }

  return dt + "/" + month + "/" + year;
};


export const formatNumber = (number, decPlaces, decSep, thouSep) => {
  (decPlaces = isNaN((decPlaces = Math.abs(decPlaces))) ? 2 : decPlaces),
    (decSep = typeof decSep === 'undefined' ? '.' : decSep);
  thouSep = typeof thouSep === 'undefined' ? ',' : thouSep;
  var sign = number < 0 ? '-' : '';
  var i = String(
    parseInt((number = Math.abs(Number(number) || 0).toFixed(decPlaces))),
  );
  var j = (j = i.length) > 3 ? j % 3 : 0;

  return (
    sign +
    (j ? i.substr(0, j) + thouSep : '') +
    i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, '$1' + thouSep) +
    (decPlaces
      ? decSep +

      Math.abs(number - i)
        .toFixed(decPlaces)
        .slice(2)
      : '')
  );
};


export   const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance.toFixed(2);
};





export const getLocationName = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    console.log('data',data)

    if (data.results.length > 0) {
      const result = data.results[0];

      // Check if there's a formatted address
      if (result.formatted_address) {
        return result.formatted_address;
      }

      // Check if there's a street address
      const streetAddress = result.address_components.find(component =>
        component.types.includes('street_address')
      );

      if (streetAddress) {
        return streetAddress.long_name;
      }

      // Check if there's a locality and administrative area level 1
      const locality = result.address_components.find(component =>
        ['locality', 'administrative_area_level_1'].includes(component.types[0])
      );

      if (locality) {
        return locality.long_name;
      }

      // If none of the above, return the first address component
      return result.address_components[0].long_name;
    } else {
      return '';
    }
  } catch (error) {
    console.error('Error fetching location data:', error);
    return '';
  }
};


export function breakTextIntoLines(text, maxLength) {
  if (text?.length <= maxLength) {
    return text;
  }

  const chunks = [];
  while (text?.length > 0) {
    chunks.push(text?.substring(0, maxLength));
    text = text.substring(maxLength);
  }

  return chunks.join('\n');
}

export function extractEventName(fullEventName) {
  // Split the full event name by backslashes
  const segments = fullEventName.split('\\');

  // Get the last segment
  const lastSegment = segments.pop();

  return lastSegment;
}


export const combineSubServices = (item) => {
  return (
    item?.request_sub_services?.map((subService) => {
      const providerSubListData = item.provider_sub_list.find(
        (providerSub) => providerSub.sub_service_id === subService.sub_service_id || providerSub.provider_sub_service_id === subService.provider_sub_service_id
      );

      return {
        ...subService,
        provider_sub_list: providerSubListData,
      };
    }) || []
  );
};

export const getStatusBackgroundColor = (status: string) => {
  switch (status) {
    case 'Requested':
      return colors.orange;
    case 'Accepted':
      return colors.blue;
    case 'Cancelled':
      return colors.dangerRed;
    case 'Rejected':
      return colors.dangerRed;
    case 'Comfirmed':
      return colors.successGreen;
    case 'Completed':
      return colors.successGreen;
    case 'Pending':
      return colors.darkYellow;
    default:
      return colors.secondary;
  }
};

export const sortByLanguage = (categories, language) => {
  const sortedCategories = [...categories]; 
  return sortedCategories.sort((a, b) => {
    const nameA = a.name[language]?.toLowerCase();
    const nameB = b.name[language]?.toLowerCase();
    return nameA.localeCompare(nameB);
  });
}

export const extractRatingData = (data) => {
  return data.map(item => ({
    id: item.id,
    reason: item.reason, // or use the appropriate language key if needed
    rating_scale: item.rating_scale,
  }));
};


export const unflatten = (data) => {
  const result = {};
  for (const key in data) {
    const keys = key.split('.');
    keys.reduce((acc, part, index) => {
      return acc[part] = acc[part] || (isNaN(Number(keys[index + 1])) ? (keys.length - 1 === index ? data[key] : {}) : []);
    }, result);
  }
  return result;
};
