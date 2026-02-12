import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import OnBoarding1 from '../../../screens/stack-screens/onBoardings/on-boarding1/OnBoarding1';
import OnBoarding2 from '../../../screens/stack-screens/onBoardings/on-boarding2/OnBoarding2';
import SignUp from '../../../auth/sign-up/SignUp';
import EmailOtp from '../../../auth/email-otp/EmailOtp';
import AccountVerified from '../../../screens/stack-screens/account-verified/AccountVerified';
import DrawerNavigation from '../drawer/DrawerNavigation';
import Login from '../../../auth/login/Login';
import ForgotPassword from '../../../auth/forgot-password/ForgotPassword';
import ForgotOtp from '../../../auth/forgot-otp/ForgotOtp';
import ResetPassword from '../../../auth/reset-password/ResetPassword';
import PasswordChanged from '../../../screens/stack-screens/password-changed/PasswordChanged';
import PlanTrip from '../../../screens/stack-screens/plan-trip/PlanTrip';
import TripImages from '../../../screens/stack-screens/trip-images/TripImages';
import ReviewTrip from '../../../screens/stack-screens/review-trip/ReviewTrip';
import TripConfirm from '../../../screens/stack-screens/trip-confirm/TripConfirm';
import Payment from '../../../screens/payments/Payment';
import ProfileEdit from '../../../screens/stack-screens/profile-edit/ProfileEdit';
import Setting from '../../../screens/stack-screens/settings/Setting';
import DeleteProfile from '../../../screens/stack-screens/delete-profile/DeleteProfile';
import { StatusBar, useColorScheme } from 'react-native';
import InternetProvider from '../../provider/InternetProvider';
import Splash from '../../../screens/stack-screens/splash-screen/Splash';

export default function AppNavigation() {
  const Stack = createNativeStackNavigator();

  const isDark = useColorScheme() === 'dark';

  <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />;

  return (
    <>
     <InternetProvider>
       <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="Splash"
          >
            {/* On-boarding screens */}
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="OnBoarding1" component={OnBoarding1} />
            <Stack.Screen name="OnBoarding2" component={OnBoarding2} />

            {/* auth */}
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="EmailOtp" component={EmailOtp} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="ForgotOtp" component={ForgotOtp} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />

            {/* account-verified */}
            <Stack.Screen name="AccountVerified" component={AccountVerified} />
            <Stack.Screen name="PasswordChanged" component={PasswordChanged} />

            {/* protected routes */}
            <Stack.Screen name="Home" component={DrawerNavigation} />
            <Stack.Screen name="PlanTrip" component={PlanTrip} />
            <Stack.Screen name="TripImages" component={TripImages} />
            <Stack.Screen name="ReviewTrip" component={ReviewTrip} />
            <Stack.Screen name="TripConfirm" component={TripConfirm} />
            <Stack.Screen name="Payment" component={Payment} />
            <Stack.Screen name="ProfileEdit" component={ProfileEdit} />
            <Stack.Screen name="DeleteProfile" component={DeleteProfile} />
            <Stack.Screen name="Setting" component={Setting} />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
     </InternetProvider>
    </>
  );
}
