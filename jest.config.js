export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '\\.(gif|ttf|eot|svg|png)$': 'identity-obj-proxy',  // Pour les fichiers statiques
    '^@app/(.*)$': '<rootDir>/src/$1',  // Pour les alias de chemin
  },

};
