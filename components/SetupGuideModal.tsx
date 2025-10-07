import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface SetupGuideModalProps {
  visible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

export default function SetupGuideModal({ visible, onClose }: SetupGuideModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [progressAnim] = useState(new Animated.Value(0));

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to ACL Setup',
      icon: 'rocket-launch',
      color: '#3b82f6',
      content: (
        <View className="space-y-6">
          <View className="items-center py-8">
            <View className="bg-blue-600/20 rounded-full p-8 mb-4">
              <MaterialIcons name="policy" size={64} color="#3b82f6" />
            </View>
            <Text className="text-white text-2xl font-bold text-center mb-2">
              Let's Set Up Your ACL
            </Text>
            <Text className="text-slate-400 text-center text-base px-4">
              This guide will walk you through configuring Headscale to manage ACL policies from the database
            </Text>
          </View>

          <View className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
            <Text className="text-white font-semibold mb-3">What you'll need:</Text>
            <View className="space-y-3">
              {[
                { icon: 'description', text: 'Access to your Headscale config file' },
                { icon: 'terminal', text: 'Command line access to your server' },
                { icon: 'code', text: 'Your ACL.json policy file ready' },
                { icon: 'restart-alt', text: 'Permission to restart Headscale' },
              ].map((item, idx) => (
                <View key={idx} className="flex-row items-center pt-2">
                  <View className="bg-blue-600 rounded-full p-2 mr-3">
                    <MaterialIcons name={item.icon as any} size={16} color="white" />
                  </View>
                  <Text className="text-slate-300 flex-1">{item.text}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className="bg-blue-900/20 border border-blue-500/30 rounded-xl mt-2 p-4">
            <View className="flex-row items-start">
              <MaterialIcons name="info" size={20} color="#3b82f6" />
              <View className="flex-1 ml-3">
                <Text className="text-blue-200 font-semibold mb-1">Estimated Time</Text>
                <Text className="text-blue-100 text-sm">
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
      color: '#8b5cf6',
      content: (
        <View className="space-y-4">
          <Text className="text-slate-300 text-base leading-6 mb-2">
            First, we need to configure Headscale to use database mode for ACL policies.
          </Text>
          
          <View className="bg-zinc-800 rounded-xl p-4 border border-zinc-700 mb-2">
            <View className="flex-row items-center mb-3">
              <View className="bg-purple-600 rounded-full p-2 mr-2">
                <MaterialIcons name="description" size={16} color="white" />
              </View>
              <Text className="text-white font-semibold">Step 1: Locate Config File</Text>
            </View>
            
            <Text className="text-slate-300 text-sm mb-3">
              Find your Headscale configuration file. Common locations:
            </Text>
            
            <View className="bg-zinc-900 rounded-lg p-3">
              <Text className="text-green-400 font-mono text-xs leading-5">
                /etc/headscale/config.yaml{'\n'}
                ~/.config/headscale/config.yaml{'\n'}
                ./config.yaml
              </Text>
            </View>
          </View>

          <View className="bg-zinc-800 rounded-xl p-4 border border-zinc-700 mb-2">
            <View className="flex-row items-center mb-3">
              <View className="bg-purple-600 rounded-full p-2 mr-2">
                <MaterialIcons name="edit" size={16} color="white" />
              </View>
              <Text className="text-white font-semibold">Step 2: Edit Policy Section</Text>
            </View>
            
            <Text className="text-slate-300 text-sm mb-3">
              Find the <Text className="text-blue-400 font-mono">policy</Text> section and update it:
            </Text>
            
            <View className="bg-zinc-900 rounded-lg p-3 mb-2">
              <Text className="text-red-400 font-mono text-xs mb-1">❌ Before:</Text>
              <Text className="text-slate-400 font-mono text-xs leading-5">
                policy:{'\n'}
                {'  '}mode: file{'\n'}
                {'  '}path: /path/to/ACL.json
              </Text>
            </View>

            <View className="bg-zinc-900 rounded-lg p-3">
              <Text className="text-green-400 font-mono text-xs mb-1">✅ After:</Text>
              <Text className="text-green-400 font-mono text-xs leading-5">
                policy:{'\n'}
                {'  '}mode: database{'\n'}
                {'  '}# path: /path/to/ACL.json
              </Text>
            </View>
          </View>

          <View className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-4 mb-2">
            <View className="flex-row items-start">
              <MaterialIcons name="warning" size={20} color="#f59e0b" />
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
      color: '#f59e0b',
      content: (
        <View className="space-y-4">
          <Text className="text-slate-300 text-base leading-6 mb-2">
            After updating your configuration, restart Headscale to apply the changes.
          </Text>
          
          <View className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
            <Text className="text-white font-semibold mb-3">Choose your setup method:</Text>
            
            <View className="space-y-3">
              <View className="bg-zinc-900 rounded-lg p-4 mb-2">
                <View className="flex-row items-center mb-2">
                  <MaterialIcons name="dns" size={20} color="#60a5fa" />
                  <Text className="text-blue-400 font-semibold ml-2">Systemd Service</Text>
                </View>
                <View className="bg-black/30 rounded p-2">
                  <Text className="text-green-400 font-mono text-sm">
                    sudo systemctl restart headscale
                  </Text>
                </View>
              </View>
              
              <View className="bg-zinc-900 rounded-lg p-4 mb-2">
                <View className="flex-row items-center mb-2">
                  <MaterialIcons name="inventory" size={20} color="#60a5fa" />
                  <Text className="text-blue-400 font-semibold ml-2">Docker Container</Text>
                </View>
                <View className="bg-black/30 rounded p-2">
                  <Text className="text-green-400 font-mono text-sm">
                    docker restart headscale
                  </Text>
                </View>
              </View>
              
              <View className="bg-zinc-900 rounded-lg p-4 mb-2">
                <View className="flex-row items-center mb-2">
                  <MaterialIcons name="computer" size={20} color="#60a5fa" />
                  <Text className="text-blue-400 font-semibold ml-2">Docker Compose</Text>
                </View>
                <View className="bg-black/30 rounded p-2">
                  <Text className="text-green-400 font-mono text-sm">
                    docker-compose restart headscale
                  </Text>
                </View>
              </View>

              <View className="bg-zinc-900 rounded-lg p-4 mb-2">
                <View className="flex-row items-center mb-2">
                  <MaterialIcons name="terminal" size={20} color="#60a5fa" />
                  <Text className="text-blue-400 font-semibold ml-2">Manual Process</Text>
                </View>
                <View className="bg-black/30 rounded p-2">
                  <Text className="text-green-400 font-mono text-sm">
                    # Stop the current process{'\n'}
                    # Then start: headscale serve
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 mt-2">
            <View className="flex-row items-start">
              <MaterialIcons name="schedule" size={20} color="#3b82f6" />
              <View className="flex-1 ml-3">
                <Text className="text-blue-200 font-semibold mb-1">Wait a moment</Text>
                <Text className="text-blue-100 text-sm leading-5">
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
      color: '#10b981',
      content: (
        <View className="space-y-4">
          <Text className="text-slate-300 text-base leading-6 mb-2">
            Now tell Headscale which ACL policy file to use in the database.
          </Text>
          
          <View className="bg-zinc-800 rounded-xl p-4 border border-zinc-700 mb-2">
            <View className="flex-row items-center mb-3">
              <View className="bg-green-600 rounded-full p-2 mr-2">
                <MaterialIcons name="terminal" size={16} color="white" />
              </View>
              <Text className="text-white font-semibold">Run This Command</Text>
            </View>
            
            <Text className="text-slate-300 text-sm mb-3">
              Execute this command to set your ACL policy:
            </Text>
            
            <View className="bg-zinc-900 rounded-lg p-4 mb-3">
              <Text className="text-green-400 font-mono text-sm leading-5">
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

          <View className="bg-zinc-800 rounded-xl p-4 border border-zinc-700 mb-2">
            <Text className="text-white font-semibold mb-3">Example ACL Structure</Text>
            <Text className="text-slate-300 text-sm mb-3">
              Your ACL.json file should look something like this:
            </Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
              <View className="bg-zinc-900 rounded-lg p-3" style={{ minWidth: width - 80 }}>
                <Text className="text-green-400 font-mono text-xs leading-5">
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

          <View className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
            <View className="flex-row items-start">
              <MaterialIcons name="error" size={20} color="#ef4444" />
              <View className="flex-1 ml-3">
                <Text className="text-red-200 font-semibold mb-1">Common Error</Text>
                <Text className="text-red-100 text-sm leading-5 mb-2">
                  If you see: <Text className="font-mono">"acl policy not found"</Text>
                </Text>
                <Text className="text-red-100 text-sm leading-5">
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
      color: '#10b981',
      content: (
        <View className="space-y-4">
          <Text className="text-slate-300 text-base leading-6 mb-2">
            Let's verify everything is working correctly!
          </Text>
          
          <View className="bg-zinc-800 rounded-xl p-4 border border-zinc-700 mb-2">
            <Text className="text-white font-semibold mb-3">Test Your Setup</Text>
            
            <View className="space-y-3">
              <View>
                <View className="flex-row items-center mb-2">
                  <View className="bg-green-600 rounded-full w-6 h-6 items-center justify-center mr-2">
                    <Text className="text-white text-xs font-bold">1</Text>
                  </View>
                  <Text className="text-slate-300 font-semibold">Check current policy</Text>
                </View>
                <View className="bg-zinc-900 rounded-lg p-3 ml-8">
                  <Text className="text-green-400 font-mono text-sm">
                    headscale policy get
                  </Text>
                </View>
              </View>

              <View>
                <View className="flex-row items-center mb-2">
                  <View className="bg-green-600 rounded-full w-6 h-6 items-center justify-center mr-2">
                    <Text className="text-white text-xs font-bold">2</Text>
                  </View>
                  <Text className="text-slate-300 font-semibold">List your users</Text>
                </View>
                <View className="bg-zinc-900 rounded-lg p-3 ml-8">
                  <Text className="text-green-400 font-mono text-sm">
                    headscale users list
                  </Text>
                </View>
              </View>

              <View>
                <View className="flex-row items-center mb-2">
                  <View className="bg-green-600 rounded-full w-6 h-6 items-center justify-center mr-2">
                    <Text className="text-white text-xs font-bold">3</Text>
                  </View>
                  <Text className="text-slate-300 font-semibold">Test this app</Text>
                </View>
                <Text className="text-slate-400 text-sm ml-8">
                  Try accessing the ACL section in this app to verify connectivity
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-green-900/20 border border-green-500/30 rounded-xl p-4 mb-2">
            <View className="flex-row items-start">
              <MaterialIcons name="celebration" size={24} color="#10b981" />
              <View className="flex-1 ml-3">
                <Text className="text-green-200 font-semibold text-lg mb-1">
                  You're All Set! 🎉
                </Text>
                <Text className="text-green-100 text-sm leading-5">
                  If you can see your ACL policy and users, your setup is complete! You can now manage your ACL policies directly from this app.
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 mb-2">
            <View className="flex-row items-start">
              <MaterialIcons name="help-outline" size={20} color="#3b82f6" />
              <View className="flex-1 ml-3">
                <Text className="text-blue-200 font-semibold mb-1">Need More Help?</Text>
                <Text className="text-blue-100 text-sm leading-5">
                  Check the Headscale documentation or the app's error messages for specific guidance if you encounter issues.
                </Text>
              </View>
            </View>
          </View>
        </View>
      ),
    },
  ];

  useEffect(() => {
    if (visible) {
      setCurrentStep(0);
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
  }, [visible]);

  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: ((currentStep + 1) / steps.length) * 100,
      tension: 50,
      friction: 7,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

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
      <View className="flex-1 bg-black/30 justify-center items-center px-4 py-2">
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="bg-zinc-900 rounded-3xl w-full max-w-2xl border-2 border-zinc-700 shadow-2xl overflow-hidden"
          style={{ maxHeight: '75%', minHeight: '80%' }}
        >
            {/* Header with gradient background */}
            <View 
              className="px-6 py-5 border-b border-zinc-700"
              style={{ backgroundColor: `${currentStepData.color}15` }}
            >
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center flex-1">
                  <View 
                    className="rounded-2xl p-3 mr-3 shadow-lg"
                    style={{ backgroundColor: currentStepData.color }}
                  >
                    <MaterialIcons name={currentStepData.icon as any} size={28} color="white" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white text-xl font-bold">{currentStepData.title}</Text>
                    <Text className="text-slate-400 text-sm mt-0.5">
                      Step {currentStep + 1} of {steps.length}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity 
                  onPress={onClose} 
                  className="bg-zinc-800 rounded-full p-2 ml-2"
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="close" size={24} color="#9ca3af" />
                </TouchableOpacity>
              </View>

              {/* Animated Progress Bar */}
              <View className="bg-zinc-800 rounded-full h-2 overflow-hidden">
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
            <View className="px-6 py-4 border-t border-zinc-700 bg-zinc-800/50">
              <View className="flex-row justify-between items-center">
                <TouchableOpacity
                  onPress={prevStep}
                  disabled={currentStep === 0}
                  className={`px-6 py-3 rounded-xl flex-row items-center ${
                    currentStep === 0 ? 'bg-zinc-800' : 'bg-zinc-700'
                  }`}
                  activeOpacity={0.7}
                >
                  <MaterialIcons 
                    name="arrow-back" 
                    size={18} 
                    color={currentStep === 0 ? '#6b7280' : 'white'} 
                  />
                  <Text className={`font-semibold ml-2 ${
                    currentStep === 0 ? 'text-slate-500' : 'text-white'
                  }`}>
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
                            : '#3f3f46',
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
                  <Text className="text-white font-bold mr-2">
                    {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Text>
                  <MaterialIcons 
                    name={currentStep === steps.length - 1 ? 'check' : 'arrow-forward'} 
                    size={18} 
                    color="white" 
                  />
                </TouchableOpacity>
              </View>
            </View>
        </Animated.View>
      </View>
    </Modal>
  );
}