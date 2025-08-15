import { useState, useEffect } from 'react';

export interface Agreement {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "completed";
  content: string;
  formData: Record<string, any>;
  userId?: string;
}

const STORAGE_KEY = 'user_agreements';

export const useAgreements = () => {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgreements();
  }, []);

  const loadAgreements = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setAgreements(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading agreements:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveAgreement = (agreementData: Omit<Agreement, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAgreement: Agreement = {
      ...agreementData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedAgreements = [newAgreement, ...agreements];
    setAgreements(updatedAgreements);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAgreements));
      return newAgreement;
    } catch (error) {
      console.error('Error saving agreement:', error);
      throw new Error('Failed to save agreement');
    }
  };

  const updateAgreement = (id: string, updates: Partial<Agreement>) => {
    const updatedAgreements = agreements.map(agreement =>
      agreement.id === id
        ? { ...agreement, ...updates, updatedAt: new Date().toISOString() }
        : agreement
    );
    
    setAgreements(updatedAgreements);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAgreements));
    } catch (error) {
      console.error('Error updating agreement:', error);
      throw new Error('Failed to update agreement');
    }
  };

  const deleteAgreement = (id: string) => {
    const updatedAgreements = agreements.filter(agreement => agreement.id !== id);
    setAgreements(updatedAgreements);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAgreements));
    } catch (error) {
      console.error('Error deleting agreement:', error);
      throw new Error('Failed to delete agreement');
    }
  };

  const getAgreement = (id: string) => {
    return agreements.find(agreement => agreement.id === id);
  };

  const getAgreementsByType = (type: string) => {
    return agreements.filter(agreement => agreement.type === type);
  };

  const getStats = () => {
    const total = agreements.length;
    const completed = agreements.filter(a => a.status === 'completed').length;
    const drafts = agreements.filter(a => a.status === 'draft').length;
    const thisMonth = agreements.filter(a => {
      const created = new Date(a.createdAt);
      const now = new Date();
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length;

    return { total, completed, drafts, thisMonth };
  };

  return {
    agreements,
    loading,
    saveAgreement,
    updateAgreement,
    deleteAgreement,
    getAgreement,
    getAgreementsByType,
    getStats,
    refresh: loadAgreements,
  };
};