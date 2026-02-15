export const formatUser = (data) => {
        const fullName = data.user?.username || 'Chosma Bazar';
        const firstName = data.user?.firstName || 'Chosma';

        const nameParts = fullName.split(" ");
        const initial = nameParts.length > 1
            ? nameParts[0][0] + nameParts[1][0]
            : fullName[0];

        return {
            email: data.user?.email || "",
            name: fullName,
            firstName,
            initial: initial.toUpperCase(),
            isLoggedIn: true,
            loginTime: new Date().toISOString(),
            user_id: data.user?.id || "",
            token: data.tokens?.accessToken || "",
            refreshToken: data.tokens?.refreshToken || "",
            ...data,
        };
    };