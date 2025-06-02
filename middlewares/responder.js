
// Function

const successResponse = (res, status, success, message, data) => {
    res.status(status).json({
        success: success,
        message: message,
        data: data || null,
    });
};

// Exports
module.exports = {
    successResponse,
};