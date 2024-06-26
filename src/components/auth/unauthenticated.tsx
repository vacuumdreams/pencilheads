import React from 'react';
import { Tabs, TabsContent } from '../ui/tabs';

import { Signin } from './sign-in';
import { Signup } from './sign-up';

export function Unauthenticated() {
  const [tab, setTab] = React.useState('signin')

  return (
    <div>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsContent value="signin">
          <Signin onChangeToSignup={() => setTab('signup')} />
        </TabsContent>
        <TabsContent value="signup">
          <Signup onChangeToSignin={() => setTab('signin')} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
