/* eslint-disable react-refresh/only-export-components */
import { db } from '@/utils/dbConfig';
import { Records, Users } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';

// Define the types used for insertion.
interface NewUserData {
  createdBy: string;
  username: string;
  age: number;
  location: string;
  folders: string[];
  treatmentCounts: number;
}

interface NewRecordData {
  userId: number;
  recordName: string;
  analysisResult: string;
  kanbanRecords: string;
  createdBy: string;
}

// Define full types including the generated id.
export interface UserType extends NewUserData {
  id: number;
}

export interface RecordType extends NewRecordData {
  id: number;
}

// Define the context interface.
interface StateContextType {
  users: UserType[];
  records: RecordType[];
  currentUser: UserType | null;
  fetchUsers: () => Promise<void>;
  fetchUserByEmail: (email: string) => Promise<void>;
  createUser: (userData: NewUserData) => Promise<UserType | null>;
  fetchUserRecords: (userEmail: string) => Promise<void>;
  createRecord: (recordData: NewRecordData) => Promise<RecordType | null>;
  updateRecord: (
    recordData: Partial<RecordType> & { documentID: number }
  ) => Promise<void>;
}

const StateContext = createContext<StateContextType | null>(null);

interface StateContextProviderProps {
  children: ReactNode;
}

export const StateContextProvider: FC<StateContextProviderProps> = ({
  children,
}) => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [records, setRecords] = useState<RecordType[]>([]);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  // Fetch all users from the database.
  const fetchUsers = useCallback(async (): Promise<void> => {
    try {
      const result = await db.select().from(Users).execute();
      setUsers(result);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, []);

  // Fetch a user by email.
  const fetchUserByEmail = useCallback(async (email: string): Promise<void> => {
    try {
      const result = await db
        .select()
        .from(Users)
        .where(eq(Users.createdBy, email))
        .execute();
      if (result.length > 0) {
        setCurrentUser(result[0]);
      }
    } catch (error) {
      console.error('Error fetching user by email:', error);
    }
  }, []);

  // Create a new user.
  const createUser = useCallback(
    async (userData: NewUserData): Promise<UserType | null> => {
      try {
        const newUser = await db
          .insert(Users)
          .values(userData)
          .returning({ id: Users.id, createdBy: Users.createdBy })
          .execute();
        // Merge the returned fields (e.g., id) with the original data.
        const createdUser: UserType = {
          ...userData,
          ...newUser[0],
        } as UserType;
        setUsers((prevUsers) => [...prevUsers, createdUser]);
        return createdUser;
      } catch (error) {
        console.error('Error creating user:', error);
        return null;
      }
    },
    []
  );

  // Fetch all records for a specific user.
  const fetchUserRecords = useCallback(
    async (userEmail: string): Promise<void> => {
      try {
        const result = await db
          .select()
          .from(Records)
          .where(eq(Records.createdBy, userEmail))
          .execute();
        setRecords(result);
      } catch (error) {
        console.error('Error fetching user records:', error);
      }
    },
    []
  );

  // Create a new record.
  const createRecord = useCallback(
    async (recordData: NewRecordData): Promise<RecordType | null> => {
      try {
        const newRecord = await db
          .insert(Records)
          .values(recordData)
          .returning({ id: Records.id })
          .execute();
        const createdRecord: RecordType = {
          ...recordData,
          ...newRecord[0],
        } as RecordType;
        setRecords((prevRecords) => [...prevRecords, createdRecord]);
        return createdRecord;
      } catch (error) {
        console.error('Error creating record:', error);
        return null;
      }
    },
    []
  );

  // Update an existing record.
  const updateRecord = useCallback(
    async (
      recordData: Partial<RecordType> & { documentID: number }
    ): Promise<void> => {
      try {
        const { documentID, ...dataToUpdate } = recordData;
        const updatedRecords = await db
          .update(Records)
          .set(dataToUpdate)
          .where(eq(Records.id, documentID))
          .returning();
        // Optionally, update local state with updatedRecords if needed.
        console.log('updated records ', updatedRecords);
      } catch (error) {
        console.error('Error updating record:', error);
      }
    },
    []
  );

  return (
    <StateContext.Provider
      value={{
        users,
        records,
        currentUser,
        fetchUsers,
        fetchUserByEmail,
        createUser,
        fetchUserRecords,
        createRecord,
        updateRecord,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = (): StateContextType => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error(
      'useStateContext must be used within a StateContextProvider'
    );
  }
  return context;
};
