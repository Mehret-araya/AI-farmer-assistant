const validateArrayResult = (value, toolName) => {
  if (!Array.isArray(value)) {
    return {
      valid: false,
      message: `${toolName} tool returned an invalid result.`,
    };
  }

  return {
    valid: true,
    message: `${toolName} tool returned a valid result.`,
  };
};

export const validateFarmerAgentToolResult = (
  toolName,
  result
) => {
  switch (toolName) {
    case "crops":
      return validateArrayResult(result, "Crops");

    case "diseaseAnalyses":
      return validateArrayResult(
        result,
        "Disease analyses"
      );

    case "weather":
      if (result === null) {
        return {
          valid: true,
          message:
            "Weather information is unavailable because no crop coordinates were found.",
        };
      }

      if (typeof result !== "object") {
        return {
          valid: false,
          message:
            "Weather tool returned an invalid result.",
        };
      }

      return {
        valid: true,
        message:
          "Weather tool returned a valid result.",
      };

    case "knowledge":
      return validateArrayResult(
        result,
        "Agricultural knowledge"
      );

    default:
      return {
        valid: false,
        message: `Unknown agent tool: ${toolName}`,
      };
  }
};