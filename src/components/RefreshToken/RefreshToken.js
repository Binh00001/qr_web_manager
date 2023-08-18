import axios from "axios";
import { createRefresh } from "react-auth-kit";
const refreshApi = createRefresh({
  interval: 60,
  refreshApiCallback: async ({
    authToken,
    authTokenExpireAt,
    refreshToken,
    refreshTokenExpiresAt,
    authUserState,
  }) => {
    // console.log(refreshToken);
    try {
      const response = await axios.post(
        "http://117.4.194.207:3003/cashier-auth/refresh",
        { 'refreshToken': refreshToken },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      return {
        isSuccess: true,
        newAuthToken: response.data.accessToken,
        newRefreshToken: response.data.refreshToken,
        newAuthTokenExpireIn: 70,
        newRefreshTokenExpiresIn: 600,
      };
    } catch (error) {
      console.error(error);
      return {
        isSuccess: false,
      };
    }
  },
});

export default refreshApi;
