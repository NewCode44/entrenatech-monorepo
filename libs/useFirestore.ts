import { useState, useEffect } from 'react';
import {
    collection,
    query,
    onSnapshot,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    QueryConstraint,
    DocumentData
} from 'firebase/firestore';
import { db } from '@/firebase';

export const useCollection = <T = DocumentData>(collectionName: string, ...queryConstraints: QueryConstraint[]) => {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        const q = query(collection(db, collectionName), ...queryConstraints);

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items: T[] = [];
            snapshot.forEach((doc) => {
                items.push({ id: doc.id, ...doc.data() } as unknown as T);
            });
            setData(items);
            setLoading(false);
        }, (err) => {
            console.error(err);
            setError(err.message);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [collectionName]);

    const add = async (newItem: any) => {
        await addDoc(collection(db, collectionName), newItem);
    };

    return { data, loading, error, add };
};

export const useDocument = <T = DocumentData>(collectionName: string, id: string) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);

        const unsubscribe = onSnapshot(doc(db, collectionName, id), (doc) => {
            if (doc.exists()) {
                setData({ id: doc.id, ...doc.data() } as unknown as T);
            } else {
                setData(null);
            }
            setLoading(false);
        }, (err) => {
            console.error(err);
            setError(err.message);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [collectionName, id]);

    const update = async (updates: any) => {
        await updateDoc(doc(db, collectionName, id), updates);
    };

    const remove = async () => {
        await deleteDoc(doc(db, collectionName, id));
    };

    return { data, loading, error, update, remove };
};
