import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const Users = () => {
  const { sendRequest, error, isloading, clearError } = useHttpClient();
  
  const [loadedUser, setLoadedUser] = useState();

  useEffect(()=>{
    const fetchUsers = async() => {
      try {
        const userData = await sendRequest('http://localhost:5000/api/users');

        setLoadedUser(userData.users);
      }
      catch (err) {
             
      }
    }
    fetchUsers();

  },[sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isloading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {(!isloading && loadedUser) && <UsersList items={loadedUser} />}
      }
    </React.Fragment>
  );
};

export default Users;
