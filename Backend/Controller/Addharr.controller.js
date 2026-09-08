import aadhaarRecords from "../AddharDummy/AddharDummy.json" with { type: "json" };

export const addAadhar = async (req, res) => {
  try {
    const phone = req.query.phone || req.body?.phone;
    console.log(phone)

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required.",
      });
    }

    const record = aadhaarRecords.find((r) => r.mobile_number === phone);

    if (record) {
      return res.status(200).json({
        success: true,
        registered: true,
        message: "Aadhar is registered.",
        data: record,
      });
    }

    return res.status(200).json({
      success: true,
      registered: false,
      message: "Aadhar is not registered. Please register your Aadhar.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
      error: error.message,
    });
  }
};