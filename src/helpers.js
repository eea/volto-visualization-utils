import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '@plone/volto/actions';
import { Unauthorized } from '@plone/volto/components';
import { Container } from 'semantic-ui-react';

export const withManagerPermission = (Component) => {
  return (props) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.users?.user);
    const userId = useSelector((state) => state.userSession?.token);

    useEffect(() => {
      if (userId) {
        dispatch(getUser(userId));
      }
    }, [dispatch, userId]);

    const isManager =
      user?.roles?.includes('Manager') ||
      user?.roles?.includes('Site Administrator');

    if (!userId || (user && !isManager)) {
      return (
        <Container id="page-document" className="view-wrapper">
          <Unauthorized />
        </Container>
      );
    }

    if (!user) {
      return null; // or a loading spinner
    }

    return <Component {...props} />;
  };
};
