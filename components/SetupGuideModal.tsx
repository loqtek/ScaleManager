import React, { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme';

interface SetupGuideModalProps {
  visible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

export default function SetupGuideModal({ visible, onClose }: SetupGuideModalProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [currentStep, setCurrentStep] = useState(0);
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const slideAnim = useMemo(() => new Animated.Value(50), []);
  const progressAnim = useMemo(() => new Animated.Value(0), []);

  const steps = useMemo(() => [
    {
      id: 'welcome',
      title: 'Welcome to ACL Setup',
      icon: 'rocket-launch',
      color: colors.primaryMuted,
      content: (
        <View className="space-y-6">
          <View className="items-center py-8">
            <View className="rounded-full p-8 mb-4" style={{ backgroundColor: colors.primarySoft }}>
              <MaterialIcons name="policy" size={64} color={colors.primaryMuted} />
            </View>
            <Text className="text-2xl font-bold text-center mb-2" style={{ color: colors.text }}>
              Let's Set Up Your ACL
            </Text>
            <Text className="text-center text-base px-4" style={{ color: colors.textMuted }}>
              This guide will walk you through configuring Headscale to manage ACL policies from the database
            </Text>
          </View>

          <View className="rounded-xl p-4 border" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <Text className="font-semibold mb-3" style={{ color: colors.text }}>What you'll need:</Text>
            <View className="space-y-3">
              {[
                { icon: 'description', text: 'Access to your Headscale config file' },
                { icon: 'terminal', text: 'Command line access to your server' },
                { icon: 'code', text: 'Your ACL.json policy file ready' },
                { icon: 'restart-alt', text: 'Permission to restart Headscale' },
              ].map((item, idx) => (
                <View key={idx} className="flex-row items-center pt-2">
                  <View className="rounded-full p-2 mr-3" style={{ backgroundColor: colors.primary }}>
                    <MaterialIcons name={item.icon as any} size={16} color={colors.onPrimary} />
                  </View>
                  <Text className="flex-1" style={{ color: colors.textSecondary }}>{item.text}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className="border rounded-xl mt-2 p-4" style={{ backgroundColor: colors.primarySoft, borderColor: colors.primaryMuted }}>
            <View className="flex-row items-start">
              <MaterialIcons name="info" size={20} color={colors.primaryMuted} />
              <View className="flex-1 ml-3">
                <Text className="font-semibold mb-1" style={{ color: colors.textSecondary }}>Estimated Time</Text>
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  This process takes about 5 minutes to complete
                </Text>
              </View>
            </View>
          </View>
        </View>
      ),
    },
    {
      id: 'config',
      title: 'Update Configuration',
      icon: 'settings',
      color: colors.primaryMuted,
      content: (
        <View className="space-y-4">
          <Text className="text-base leading-6 mb-2" style={{ color: colors.textSecondary }}>
            First, we need to configure Headscale to use database mode for ACL policies.
          </Text>
          
          <View className="rounded-xl p-4 border mb-2" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <View className="flex-row items-center mb-3">
              <View className="rounded-full p-2 mr-2" style={{ backgroundColor: colors.primary }}>
                <MaterialIcons name="description" size={16} color={colors.onPrimary} />
              </View>
              <Text className="font-semibold" style={{ color: colors.text }}>Step 1: Locate Config File</Text>
            </View>
            
            <Text className="text-sm mb-3" style={{ color: colors.textSecondary }}>
              Find your Headscale configuration file. Common locations:
            </Text>
            
            <View className="rounded-lg p-3" style={{ backgroundColor: colors.background }}>
              <Text className="font-mono text-xs leading-5" style={{ color: colors.success }}>
                /etc/headscale/config.yaml{'\n'}
                ~/.config/headscale/config.yaml{'\n'}
                ./config.yaml
              </Text>
            </View>
          </View>

          <View className="rounded-xl p-4 border mb-2" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <View className="flex-row items-center mb-3">
              <View className="rounded-full p-2 mr-2" style={{ backgroundColor: colors.primary }}>
                <MaterialIcons name="edit" size={16} color={colors.onPrimary} />
              </View>
              <Text className="font-semibold" style={{ color: colors.text }}>Step 2: Edit Policy Section</Text>
            </View>
            
            <Text className="text-sm mb-3" style={{ color: colors.textSecondary }}>
              Find the <Text className="font-mono" style={{ color: colors.primaryMuted }}>policy</Text> section and update it:
            </Text>
            
            <View className="rounded-lg p-3 mb-2" style={{ backgroundColor: colors.background }}>
              <Text className="font-mono text-xs mb-1" style={{ color: colors.error }}>❌ Before:</Text>
              <Text className="font-mono text-xs leading-5" style={{ color: colors.textMuted }}>
                policy:{'\n'}
                {'  '}mode: file{'\n'}
                {'  '}path: /path/to/ACL.json
              </Text>
            </View>

            <View className="rounded-lg p-3" style={{ backgroundColor: colors.background }}>
              <Text className="font-mono text-xs mb-1" style={{ color: colors.success }}>✅ After:</Text>
              <Text className="font-mono text-xs leading-5" style={{ color: colors.success }}>
                policy:{'\n'}
                {'  '}mode: database{'\n'}
                {'  '}# path: /path/to/ACL.json
              </Text>
            </View>
          </View>

          <View className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-4 mb-2">
            <View className="flex-row items-start">
              <MaterialIcons name="warning" size={20} color={colors.warning} />
              <View className="flex-1 ml-3">
                <Text className="text-amber-200 font-semibold mb-1">Critical</Text>
                <Text className="text-amber-100 text-sm leading-5">
                  Make sure to set <Text className="font-mono">mode: database</Text> and comment out or remove the <Text className="font-mono">path</Text> line completely!
                </Text>
              </View>
            </View>
          </View>
        </View>
      ),
    },
    {
      id: 'restart',
      title: 'Restart Headscale',
      icon: 'restart-alt',
      color: colors.warning,
      content: (
        <View className="space-y-4">
          <Text className="text-base leading-6 mb-2" style={{ color: colors.textSecondary }}>
            After updating your configuration, restart Headscale to apply the changes.
          </Text>
          
          <View className="rounded-xl p-4 border" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <Text className="font-semibold mb-3" style={{ color: colors.text }}>Choose your setup method:</Text>
            
            <View className="space-y-3">
              <View className="rounded-lg p-4 mb-2" style={{ backgroundColor: colors.background }}>
                <View className="flex-row items-center mb-2">
                  <MaterialIcons name="dns" size={20} color={colors.primaryMuted} />
                  <Text className="font-semibold ml-2" style={{ color: colors.primaryMuted }}>Systemd Service</Text>
                </View>
                <View className="bg-black/30 rounded p-2">
                  <Text className="font-mono text-sm" style={{ color: colors.success }}>
                    sudo systemctl restart headscale
                  </Text>
                </View>
              </View>
              
              <View className="rounded-lg p-4 mb-2" style={{ backgroundColor: colors.background }}>
                <View className="flex-row items-center mb-2">
                  <MaterialIcons name="inventory" size={20} color={colors.primaryMuted} />
                  <Text className="font-semibold ml-2" style={{ color: colors.primaryMuted }}>Docker Container</Text>
                </View>
                <View className="bg-black/30 rounded p-2">
                  <Text className="font-mono text-sm" style={{ color: colors.success }}>
                    docker restart headscale
                  </Text>
                </View>
              </View>
              
              <View className="rounded-lg p-4 mb-2" style={{ backgroundColor: colors.background }}>
                <View className="flex-row items-center mb-2">
                  <MaterialIcons name="computer" size={20} color={colors.primaryMuted} />
                  <Text className="font-semibold ml-2" style={{ color: colors.primaryMuted }}>Docker Compose</Text>
                </View>
                <View className="bg-black/30 rounded p-2">
                  <Text className="font-mono text-sm" style={{ color: colors.success }}>
                    docker-compose restart headscale
                  </Text>
                </View>
              </View>

              <View className="rounded-lg p-4 mb-2" style={{ backgroundColor: colors.background }}>
                <View className="flex-row items-center mb-2">
                  <MaterialIcons name="terminal" size={20} color={colors.primaryMuted} />
                  <Text className="font-semibold ml-2" style={{ color: colors.primaryMuted }}>Manual Process</Text>
                </View>
                <View className="bg-black/30 rounded p-2">
                  <Text className="font-mono text-sm" style={{ color: colors.success }}>
                    # Stop the current process{'\n'}
                    # Then start: headscale serve
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View className="border rounded-xl p-4 mt-2" style={{ backgroundColor: colors.primarySoft, borderColor: colors.primaryMuted }}>
            <View className="flex-row items-start">
              <MaterialIcons name="schedule" size={20} color={colors.primaryMuted} />
              <View className="flex-1 ml-3">
                <Text className="font-semibold mb-1" style={{ color: colors.textSecondary }}>Wait a moment</Text>
                <Text className="text-sm leading-5" style={{ color: colors.textSecondary }}>
                  Give Headscale 5-10 seconds to fully restart before continuing to the next step
                </Text>
              </View>
            </View>
          </View>
        </View>
      ),
    },
    {
      id: 'set-policy',
      title: 'Set ACL Policy',
      icon: 'code',
      color: colors.success,
      content: (
        <View className="space-y-4">
          <Text className="text-base leading-6 mb-2" style={{ color: colors.textSecondary }}>
            Now tell Headscale which ACL policy file to use in the database.
          </Text>
          
          <View className="rounded-xl p-4 border mb-2" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <View className="flex-row items-center mb-3">
              <View className="rounded-full p-2 mr-2" style={{ backgroundColor: colors.success }}>
                <MaterialIcons name="terminal" size={16} color={colors.onPrimary} />
              </View>
              <Text className="font-semibold" style={{ color: colors.text }}>Run This Command</Text>
            </View>
            
            <Text className="text-sm mb-3" style={{ color: colors.textSecondary }}>
              Execute this command to set your ACL policy:
            </Text>
            
            <View className="rounded-lg p-4 mb-3" style={{ backgroundColor: colors.background }}>
              <Text className="font-mono text-sm leading-5" style={{ color: colors.success }}>
                headscale policy set \{'\n'}
                {'  '}--file /path/to/your/ACL.json
              </Text>
            </View>
            
            <View className="bg-amber-900/30 border border-amber-600/30 rounded-lg p-3">
              <Text className="text-amber-300 text-sm">
                <Text className="font-semibold">Important:</Text> Replace{' '}
                <Text className="font-mono">/path/to/your/ACL.json</Text> with the actual path to your ACL file!
              </Text>
            </View>
          </View>

          <View className="rounded-xl p-4 border mb-2" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <Text className="font-semibold mb-3" style={{ color: colors.text }}>Example ACL Structure</Text>
            <Text className="text-sm mb-3" style={{ color: colors.textSecondary }}>
              Your ACL.json file should look something like this:
            </Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
              <View className="rounded-lg p-3" style={{ backgroundColor: colors.background, minWidth: width - 80 }}>
                <Text className="font-mono text-xs leading-5" style={{ color: colors.success }}>
{`{
  "hosts": {
    "server-1": "100.64.0.1",
    "laptop": "100.64.0.2"
  },
  "groups": {
    "group:admins": [
      "admin@example.com"
    ],
    "group:users": [
      "user@example.com"
    ]
  },
  "acls": [
    {
      "action": "accept",
      "src": ["group:admins"],
      "dst": ["*:*"]
    },
    {
      "action": "accept",
      "src": ["group:users"],
      "dst": ["server-1:80,443"]
    }
  ]
}`}
                </Text>
              </View>
            </ScrollView>
          </View>

          <View className="border rounded-xl p-4" style={{ backgroundColor: colors.errorSoft, borderColor: colors.error }}>
            <View className="flex-row items-start">
              <MaterialIcons name="error" size={20} color={colors.error} />
              <View className="flex-1 ml-3">
                <Text className="font-semibold mb-1" style={{ color: colors.error }}>Common Error</Text>
                <Text className="text-sm leading-5 mb-2" style={{ color: colors.text }}>
                  If you see: <Text className="font-mono">"acl policy not found"</Text>
                </Text>
                <Text className="text-sm leading-5" style={{ color: colors.text }}>
                  This means you need to run the command above to set your ACL file path in the database.
                </Text>
              </View>
            </View>
          </View>
        </View>
      ),
    },
    {
      id: 'verify',
      title: 'Verify & Test',
      icon: 'check-circle',
      color: colors.success,
      content: (
        <View className="space-y-4">
          <Text className="text-base leading-6 mb-2" style={{ color: colors.textSecondary }}>
            Let's verify everything is working correctly!
          </Text>
          
          <View className="rounded-xl p-4 border mb-2" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <Text className="font-semibold mb-3" style={{ color: colors.text }}>Test Your Setup</Text>
            
            <View className="space-y-3">
              <View>
                <View className="flex-row items-center mb-2">
                  <View className="rounded-full w-6 h-6 items-center justify-center mr-2" style={{ backgroundColor: colors.success }}>
                    <Text className="text-xs font-bold" style={{ color: colors.onPrimary }}>1</Text>
                  </View>
                  <Text className="font-semibold" style={{ color: colors.textSecondary }}>Check current policy</Text>
                </View>
                <View className="rounded-lg p-3 ml-8" style={{ backgroundColor: colors.background }}>
                  <Text className="font-mono text-sm" style={{ color: colors.success }}>
                    headscale policy get
                  </Text>
                </View>
              </View>

              <View>
                <View className="flex-row items-center mb-2">
                  <View className="rounded-full w-6 h-6 items-center justify-center mr-2" style={{ backgroundColor: colors.success }}>
                    <Text className="text-xs font-bold" style={{ color: colors.onPrimary }}>2</Text>
                  </View>
                  <Text className="font-semibold" style={{ color: colors.textSecondary }}>List your users</Text>
                </View>
                <View className="rounded-lg p-3 ml-8" style={{ backgroundColor: colors.background }}>
                  <Text className="font-mono text-sm" style={{ color: colors.success }}>
                    headscale users list
                  </Text>
                </View>
              </View>

              <View>
                <View className="flex-row items-center mb-2">
                  <View className="rounded-full w-6 h-6 items-center justify-center mr-2" style={{ backgroundColor: colors.success }}>
                    <Text className="text-xs font-bold" style={{ color: colors.onPrimary }}>3</Text>
                  </View>
                  <Text className="font-semibold" style={{ color: colors.textSecondary }}>Test this app</Text>
                </View>
                <Text className="text-sm ml-8" style={{ color: colors.textMuted }}>
                  Try accessing the ACL section in this app to verify connectivity
                </Text>
              </View>
            </View>
          </View>

          <View className="border rounded-xl p-4 mb-2" style={{ backgroundColor: colors.successSoft, borderColor: colors.success }}>
            <View className="flex-row items-start">
              <MaterialIcons name="celebration" size={24} color={colors.success} />
              <View className="flex-1 ml-3">
                <Text className="font-semibold text-lg mb-1" style={{ color: colors.success }}>
                  You're All Set! 🎉
                </Text>
                <Text className="text-sm leading-5" style={{ color: colors.text }}>
                  If you can see your ACL policy and users, your setup is complete! You can now manage your ACL policies directly from this app.
                </Text>
              </View>
            </View>
          </View>

          <View className="border rounded-xl p-4 mb-2" style={{ backgroundColor: colors.primarySoft, borderColor: colors.primaryMuted }}>
            <View className="flex-row items-start">
              <MaterialIcons name="help-outline" size={20} color={colors.primaryMuted} />
              <View className="flex-1 ml-3">
                <Text className="font-semibold mb-1" style={{ color: colors.textSecondary }}>Need More Help?</Text>
                <Text className="text-sm leading-5" style={{ color: colors.textSecondary }}>
                  Check the Headscale documentation or the app's error messages for specific guidance if you encounter issues.
                </Text>
              </View>
            </View>
          </View>
        </View>
      ),
    },
  ], [colors]);

  const [wasVisible, setWasVisible] = useState(visible);
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) setCurrentStep(0);
  }

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Animate progress bar
      Animated.timing(progressAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: false,
      }).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
      progressAnim.setValue(0);
    }
  }, [visible, fadeAnim, slideAnim, progressAnim]);

  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: ((currentStep + 1) / steps.length) * 100,
      tension: 50,
      friction: 7,
      useNativeDriver: false,
    }).start();
  }, [currentStep, progressAnim, steps.length]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center px-4 py-2" style={{ backgroundColor: colors.overlay }}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            maxHeight: '75%',
            minHeight: '80%',
            backgroundColor: colors.background,
            borderColor: colors.border,
          }}
          className="rounded-3xl w-full max-w-2xl border-2 shadow-2xl overflow-hidden"
        >
            {/* Header with gradient background */}
            <View
              className="px-6 py-5 border-b"
              style={{ borderColor: colors.border, backgroundColor: `${currentStepData.color}15` }}
            >
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center flex-1">
                  <View 
                    className="rounded-2xl p-3 mr-3 shadow-lg"
                    style={{ backgroundColor: currentStepData.color }}
                  >
                    <MaterialIcons name={currentStepData.icon as any} size={28} color={colors.onPrimary} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xl font-bold" style={{ color: colors.text }}>{currentStepData.title}</Text>
                    <Text className="text-sm mt-0.5" style={{ color: colors.textMuted }}>
                      Step {currentStep + 1} of {steps.length}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity 
                  onPress={onClose} 
                  className="rounded-full p-2 ml-2" style={{ backgroundColor: colors.surface }}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="close" size={24} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              {/* Animated Progress Bar */}
              <View className="rounded-full h-2 overflow-hidden" style={{ backgroundColor: colors.surface }}>
                <Animated.View
                  className="h-2 rounded-full"
                  style={{
                    backgroundColor: currentStepData.color,
                    width: progressAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }),
                  }}
                />
              </View>
            </View>

            {/* Content */}
            <ScrollView 
              className="flex-1 px-6 py-6" 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {currentStepData.content}
            </ScrollView>

            {/* Footer */}
            <View className="px-6 py-4 border-t" style={{ borderColor: colors.border, backgroundColor: colors.surface }}>
              <View className="flex-row justify-between items-center">
                <TouchableOpacity
                  onPress={prevStep}
                  disabled={currentStep === 0}
                  className="px-6 py-3 rounded-xl flex-row items-center"
                  style={{ backgroundColor: currentStep === 0 ? colors.surface : colors.surfaceMuted }}
                  activeOpacity={0.7}
                >
                  <MaterialIcons 
                    name="arrow-back" 
                    size={18} 
                    color={currentStep === 0 ? colors.muted : colors.text} 
                  />
                  <Text className="font-semibold ml-2" style={{ color: currentStep === 0 ? colors.muted : colors.text }}>
                    Back
                  </Text>
                </TouchableOpacity>

                {/* Step Indicators */}
                <View className="flex-row gap-2">
                  {steps.map((step, index) => (
                    <View
                      key={index}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: index === currentStep ? 24 : 8,
                        height: 8,
                        backgroundColor: index === currentStep 
                          ? currentStepData.color
                          : index < currentStep 
                            ? `${currentStepData.color}60`
                            : colors.border,
                      }}
                    />
                  ))}
                </View>

                <TouchableOpacity
                  onPress={nextStep}
                  className="px-6 py-3 rounded-xl flex-row items-center shadow-lg"
                  style={{ backgroundColor: currentStepData.color }}
                  activeOpacity={0.8}
                >
                  <Text className="font-bold mr-2" style={{ color: colors.onPrimary }}>
                    {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Text>
                  <MaterialIcons 
                    name={currentStep === steps.length - 1 ? 'check' : 'arrow-forward'} 
                    size={18} 
                    color={colors.onPrimary} 
                  />
                </TouchableOpacity>
              </View>
            </View>
        </Animated.View>
      </View>
    </Modal>
  );
}