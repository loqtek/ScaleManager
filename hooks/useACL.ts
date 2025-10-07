import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { getACLPolicy, updateACLPolicy } from "@/app/api/acl";

interface PolicyVersion {
  id: string;
  policy: string;
  timestamp: Date;
}

interface ACLHookReturn {
  // State
  policy: string;
  originalPolicy: string;
  loading: boolean;
  saving: boolean;
  policyVersions: PolicyVersion[];
  showVersions: boolean;
  editing: boolean;
  editText: string;
  showSetupGuide: boolean;
  showErrorModal: boolean;
  currentError: any;

  // Actions
  fetchPolicy: () => Promise<void>;
  savePolicy: () => Promise<void>;
  startEditing: () => void;
  cancelEditing: () => void;
  restoreVersion: (version: PolicyVersion) => void;
  deleteVersion: (versionId: string) => void;
  onRefresh: () => void;

  // Modal controls
  setShowVersions: (show: boolean) => void;
  setShowSetupGuide: (show: boolean) => void;
  setShowErrorModal: (show: boolean) => void;
  setCurrentError: (error: any) => void;
  setEditText: (text: string) => void;
}

export const useACL = (): ACLHookReturn => {
  // State management
  const [policy, setPolicy] = useState<string>("");
  const [originalPolicy, setOriginalPolicy] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [policyVersions, setPolicyVersions] = useState<PolicyVersion[]>([]);
  const [showVersions, setShowVersions] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [currentError, setCurrentError] = useState<any>(null);

  // Fetch policy function
  const fetchPolicy = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getACLPolicy();
      console.log('Fetch response:', response);
      
      if (response && "policy" in response) {
        let formattedPolicy = response.policy;
        
        // Parse and format JSON properly
        try {
          const parsedPolicy = JSON.parse(formattedPolicy);
          formattedPolicy = JSON.stringify(parsedPolicy, null, 2);
        } catch (e) {
          formattedPolicy = formattedPolicy.replace(/\\n/g, '\n');
        }
        
        setPolicy(formattedPolicy);
        setOriginalPolicy(formattedPolicy);
      } else {
        Alert.alert("Error", "Failed to fetch ACL policy");
      }
    } catch (error: any) {
      console.error("Error fetching policy:", error);
      
      // Check for specific errors and show error modal
      const errorMessage = error?.message || error?.toString() || '';
      
      if (errorMessage.includes('acl policy not found') || 
          errorMessage.includes('loading ACL from database')) {
        setCurrentError({
          message: 'loading ACL from database: acl policy not found',
          type: 'policy-not-found'
        });
        setShowErrorModal(true);
        return;
      }
      
      if (errorMessage.includes('update is disabled for modes other than \'database\'') ||
          errorMessage.includes('update is disabled')) {
        setCurrentError({
          message: 'update is disabled for modes other than \'database\'',
          type: 'mode-not-database'
        });
        setShowErrorModal(true);
        return;
      }
      
      // Generic error
      setCurrentError({ message: errorMessage });
      Alert.alert("Error", "Failed to fetch ACL policy. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Save policy function
  const savePolicy = useCallback(async () => {
    try {
      setSaving(true);
      console.log("Saving policy:", editText);
      
      // Validate JSON
      let parsedPolicy;
      try {
        parsedPolicy = JSON.parse(editText);
      } catch (e) {
        Alert.alert("Invalid JSON", "Please check your JSON syntax before saving.");
        return;
      }

      // Save current version to history
      if (policy) {
        const newVersion: PolicyVersion = {
          id: Date.now().toString(),
          policy: policy,
          timestamp: new Date(),
        };
        setPolicyVersions(prev => [newVersion, ...prev].slice(0, 20)); // Keep last 20 versions
      }

      // Update the policy
      console.log("Parsed policy:", parsedPolicy);
      const response = await updateACLPolicy(parsedPolicy);
      console.log("Update response:", response);
      
      if (response) {
        setPolicy(editText);
        setOriginalPolicy(editText);
        setEditing(false);
        Alert.alert("Success", "ACL policy updated successfully! 🎉");
      } else {
        Alert.alert("Error", "Failed to update ACL policy");
      }
    } catch (error: any) {
      console.error("Error saving policy:", error);
      
      // Check for specific errors
      const errorMessage = error?.message || error?.toString() || '';
      
      if (errorMessage.includes('update is disabled for modes other than \'database\'') ||
          errorMessage.includes('update is disabled')) {
        setCurrentError({
          message: 'update is disabled for modes other than \'database\'',
          type: 'mode-not-database'
        });
        setShowErrorModal(true);
        setEditing(false);
        return;
      }
      
      Alert.alert("Error", "Failed to update ACL policy. Please try again.");
    } finally {
      setSaving(false);
    }
  }, [editText, policy]);

  // Start editing function
  const startEditing = useCallback(() => {
    setEditText(policy);
    setEditing(true);
  }, [policy]);

  // Cancel editing function
  const cancelEditing = useCallback(() => {
    if (editText !== policy) {
      Alert.alert(
        "Discard Changes?",
        "You have unsaved changes. Are you sure you want to discard them?",
        [
          { text: "Keep Editing", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => {
              setEditing(false);
              setEditText("");
            }
          }
        ]
      );
    } else {
      setEditing(false);
      setEditText("");
    }
  }, [editText, policy]);

  // Restore version function
  const restoreVersion = useCallback((version: PolicyVersion) => {
    Alert.alert(
      "Restore Policy Version?",
      `Restore policy from ${version.timestamp.toLocaleString()}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Restore",
          onPress: () => {
            setEditText(version.policy);
            setEditing(true);
            setShowVersions(false);
          }
        }
      ]
    );
  }, []);

  // Delete version function
  const deleteVersion = useCallback((versionId: string) => {
    Alert.alert(
      "Delete Version",
      "Are you sure you want to delete this policy version?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setPolicyVersions(prev => prev.filter(v => v.id !== versionId));
          }
        }
      ]
    );
  }, []);

  // Refresh function
  const onRefresh = useCallback(() => {
    fetchPolicy();
  }, [fetchPolicy]);

  // Initialize on mount
  useEffect(() => {
    fetchPolicy();
  }, [fetchPolicy]);

  return {
    // State
    policy,
    originalPolicy,
    loading,
    saving,
    policyVersions,
    showVersions,
    editing,
    editText,
    showSetupGuide,
    showErrorModal,
    currentError,

    // Actions
    fetchPolicy,
    savePolicy,
    startEditing,
    cancelEditing,
    restoreVersion,
    deleteVersion,
    onRefresh,

    // Modal controls
    setShowVersions,
    setShowSetupGuide,
    setShowErrorModal,
    setCurrentError,
    setEditText,
  };
};

