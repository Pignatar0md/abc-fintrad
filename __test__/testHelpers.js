export const createTestProps = (props) => ({
  navigation: {
    navigate: jest.fn(),
    setOptions: () => ({
      headerShown: false,
    }),
  },
  ...props,
});
