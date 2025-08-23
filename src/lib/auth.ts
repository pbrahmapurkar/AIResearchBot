// Mock authentication for testing report generation system
// This will be replaced with proper NextAuth when compatibility issues are resolved

export const authOptions = {
  providers: [],
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session(params: { session: any }) {
      return {
        ...params.session,
        user: {
          id: 'mock-user-id',
          email: 'test@example.com',
          name: 'Test User',
          role: 'ADMIN',
          orgId: 'mock-org-id'
        }
      }
    }
  }
};

export const auth = async () => {
  // Mock session for testing
  return {
    user: {
      id: 'mock-user-id',
      email: 'test@example.com',
      name: 'Test User',
      role: 'ADMIN',
      orgId: 'mock-org-id'
    }
  }
}
