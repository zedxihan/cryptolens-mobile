const { withAppBuildGradle } = require('@expo/config-plugins');

const withSeparateBuilds = (config) => {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      config.modResults.contents = addSeparateBuilds(
        config.modResults.contents,
      );
    }
    return config;
  });
};

function addSeparateBuilds(buildGradle) {
  if (
    !buildGradle.includes('def enableSeparateBuildPerCPUArchitecture = true')
  ) {
    buildGradle = buildGradle.replace(
      /apply plugin: "com.facebook.react"/,
      'apply plugin: "com.facebook.react"\n\ndef enableSeparateBuildPerCPUArchitecture = true',
    );
  }

  if (!buildGradle.includes('splits {')) {
    const splitsBlock = `
    splits {
        abi {
            reset()
            enable enableSeparateBuildPerCPUArchitecture
            universalApk true
            include "armeabi-v7a", "arm64-v8a", "x86_64"
        }
    }\n`;
    buildGradle = buildGradle.replace(
      /android\s*{/,
      `android {\n${splitsBlock}`,
    );
  }

  return buildGradle;
}

module.exports = withSeparateBuilds;
