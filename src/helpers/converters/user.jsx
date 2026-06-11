export const formatUser = (data) => {
        const fullName = data.user?.username || 'User';
        const firstName = data.user?.firstName || '';

        const nameParts = fullName.split(" ");
        const initial = nameParts.length > 1
            ? nameParts[0][0] + nameParts[1][0]
            : (fullName[0] || 'U');

        const userId = data.user?.id || data.user?.userId || data.userId || data.user_id || "";

        return {
            email: data.user?.email || "",
            name: fullName,
            firstName,
            initial: initial.toUpperCase(),
            isLoggedIn: true,
            loginTime: new Date().toISOString(),
            user_id: userId,
            userId,
            token: data.tokens?.accessToken || "",
            refreshToken: data.tokens?.refreshToken || "",
            ...data,
        };
    };